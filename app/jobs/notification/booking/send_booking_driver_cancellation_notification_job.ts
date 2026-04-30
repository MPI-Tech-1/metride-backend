import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import BookingActions from '#model_management/actions/booking_actions'
import CustomerNotificationActions from '#model_management/actions/customer_notification_actions'
import DriverNotificationActions from '#model_management/actions/driver_notification_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendBookingDriverCancellationNotificationJobPayload {
  bookingId: number
}

export default class SendBookingDriverCancellationNotificationJob extends Job<SendBookingDriverCancellationNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendBookingDriverCancellationNotificationJob', this.payload)
    const { bookingId } = this.payload

    const booking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!booking) {
      throw new Error('SendBookingDriverCancellationNotificationJob: booking not found')
    }

    const dbTransaction = await db.transaction()

    const notificationType = 'bookings:booking_cancellation'

    try {
      if (booking.assignedDriverId) {
        await DriverNotificationActions.createDriverNotificationRecord({
          createPayload: {
            driverId: booking.assignedDriverId,
            content: 'A Booking you were assigned too was cancelled. Kindly reachout to the admin',
            isNotificationRead: false,
            payload: {
              identifier: booking.identifier,
            },
            notificationType,
          },
          dbTransactionOptions: { dbTransaction, useTransaction: true },
        })
      }

      const customerNotification =
        await CustomerNotificationActions.createCustomerNotificationRecord({
          createPayload: {
            customerId: booking.customerId,
            content: 'Your booking has been cancelled, Kindly reachout to the admin',
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
            title: 'Cancelled Booking',
            body: 'A Booking you were assigned too was cancelled',
          },
          data: {},
        })
      }

      if (booking.customer.fcmToken) {
        await pushNotificationProvider.send({
          token: booking.customer.fcmToken,
          notification: {
            title: 'Booking Driver Cancelled',
            body: customerNotification.content,
          },
          data: {},
        })
      }
    } catch (sendBookingDriverCancellationNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendBookingDriverCancellationNotificationJobError => ',
        sendBookingDriverCancellationNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendBookingDriverCancellationNotificationJob failed:', error.message)
  }
}
