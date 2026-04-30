import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import BookingActions from '#model_management/actions/booking_actions'
import CustomerNotificationActions from '#model_management/actions/customer_notification_actions'
import DriverNotificationActions from '#model_management/actions/driver_notification_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendBookingCompletedNotificationJobPayload {
  bookingId: number
}

export default class SendBookingCompletedNotificationJob extends Job<SendBookingCompletedNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendBookingCompletedNotificationJob', this.payload)
    const { bookingId } = this.payload

    const booking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!booking) {
      throw new Error('SendBookingCompletedNotificationJob: booking not found')
    }

    const dbTransaction = await db.transaction()

    const notificationType = 'bookings:booking_completed'

    try {
      if (booking.assignedDriverId) {
        await DriverNotificationActions.createDriverNotificationRecord({
          createPayload: {
            driverId: booking.assignedDriverId,
            content: 'A booking you were assigned to has been completed.',
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
            content: 'Your booking has been completed. Thank you for riding with us!',
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

      if (booking.assignedDriver?.fcmToken) {
        await pushNotificationProvider.send({
          token: booking.assignedDriver.fcmToken,
          notification: {
            title: 'Booking Completed',
            body: 'A booking you were assigned to has been completed.',
          },
          data: {},
        })
      }

      if (booking.customer.fcmToken) {
        await pushNotificationProvider.send({
          token: booking.customer.fcmToken,
          notification: {
            title: 'Booking Completed',
            body: customerNotification.content,
          },
          data: {},
        })
      }
    } catch (sendBookingCompletedNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendBookingCompletedNotificationJobError => ',
        sendBookingCompletedNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendBookingCompletedNotificationJob failed:', error.message)
  }
}
