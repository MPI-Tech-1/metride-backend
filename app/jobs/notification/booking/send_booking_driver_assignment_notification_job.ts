import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import BookingActions from '#model_management/actions/booking_actions'
import CustomerNotificationActions from '#model_management/actions/customer_notification_actions'
import DriverNotificationActions from '#model_management/actions/driver_notification_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import logApplicationError from '#common/helper_functions/log_application_error'
import logBookingUpdatePayload from '#common/helper_functions/log_booking_update_payload'
import createBookingSlackEventPayload from '#common/helper_functions/create_booking_slack_event_payload'

export interface SendBookingDriverAssignmentNotificationJobPayload {
  bookingId: number
}

export default class SendBookingDriverAssignmentNotificationJob extends Job<SendBookingDriverAssignmentNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendBookingDriverAssignmentNotificationJob', this.payload)
    const { bookingId } = this.payload

    const booking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!booking) {
      throw new Error('SendBookingDriverAssignmentNotificationJob: booking not found')
    }

    if (!booking.assignedDriverId) {
      throw new Error('SendBookingDriverAssignmentNotificationJob: booking has no assigned driver')
    }

    await logBookingUpdatePayload(
      createBookingSlackEventPayload({
        eventType: 'driver_assigned',
        booking,
        summary: `Driver assignment notifications are being sent for booking ${booking.identifier}.`,
        metadata: {
          notificationType: 'bookings:driver_assignment',
        },
      })
    )

    const dbTransaction = await db.transaction()

    const notificationType = 'bookings:driver_assignment'

    try {
      const driverNotification = await DriverNotificationActions.createDriverNotificationRecord({
        createPayload: {
          driverId: booking.assignedDriverId,
          content: 'You have been assigned to a booking. Kindly arrive there on time',
          isNotificationRead: false,
          payload: {
            identifier: booking.identifier,
          },
          notificationType,
        },
        dbTransactionOptions: { dbTransaction, useTransaction: true },
      })

      const customerNotification =
        await CustomerNotificationActions.createCustomerNotificationRecord({
          createPayload: {
            customerId: booking.customerId,
            content: 'A driver has been assigned to your booking',
            isNotificationRead: false,
            payload: {
              identifier: booking.identifier,
            },
            notificationType,
          },
          dbTransactionOptions: { dbTransaction, useTransaction: true },
        })
      await dbTransaction.commit()

      const pushNotificationProvider = configurePushNotificationProvider()

      if (booking.assignedDriver.fcmToken) {
        await pushNotificationProvider.send({
          token: booking.assignedDriver.fcmToken!,
          notification: {
            title: 'Assigned to Booking',
            body: driverNotification.content,
          },
          data: {
            identifier: driverNotification.identifier,
            content: driverNotification.content,
          },
        })
      }

      if (booking.customer.fcmToken) {
        await pushNotificationProvider.send({
          token: booking.customer.fcmToken!,
          notification: {
            title: 'Assigned to Booking',
            body: customerNotification.content,
          },
          data: {
            identifier: customerNotification.identifier,
            content: customerNotification.content,
          },
        })
      }
    } catch (sendBookingDriverAssignmentNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendBookingDriverAssignmentNotificationJobError => ',
        sendBookingDriverAssignmentNotificationJobError
      )
      await logApplicationError(sendBookingDriverAssignmentNotificationJobError)
    }
  }

  async failed(error: Error) {
    console.error('SendBookingDriverAssignmentNotificationJob failed:', error.message)
    await logApplicationError(error)
  }
}
