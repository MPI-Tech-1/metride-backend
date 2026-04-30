import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import BookingActions from '#model_management/actions/booking_actions'
import CustomerNotificationActions from '#model_management/actions/customer_notification_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendBookingRejectedNotificationJobPayload {
  bookingId: number
}

export default class SendBookingRejectedNotificationJob extends Job<SendBookingRejectedNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendBookingRejectedNotificationJob', this.payload)
    const { bookingId } = this.payload

    const booking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!booking) {
      throw new Error('SendBookingRejectedNotificationJob: booking not found')
    }

    if (booking.status !== 'rejected') {
      throw new Error('SendBookingRejectedNotificationJob: booking has not been rejected')
    }

    const dbTransaction = await db.transaction()

    try {
      const customerNotification =
        await CustomerNotificationActions.createCustomerNotificationRecord({
          createPayload: {
            customerId: booking.customerId,
            content: 'Your booking has been rejected. Please try booking again.',
            isNotificationRead: false,
            payload: {
              identifier: booking.identifier,
            },
            notificationType: 'bookings:rejected',
          },
          dbTransactionOptions: { dbTransaction, useTransaction: true },
        })

      await dbTransaction.commit()

      if (booking.customer.fcmToken) {
        const pushNotificationProvider = configurePushNotificationProvider()

        await pushNotificationProvider.send({
          token: booking.customer.fcmToken!,
          notification: {
            title: 'Booking Rejected',
            body: customerNotification.content,
          },
          data: {
            identifier: customerNotification.identifier,
            content: customerNotification.content,
          },
        })
      }
    } catch (sendBookingRejectedNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendBookingRejectedNotificationJobError => ',
        sendBookingRejectedNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendBookingRejectedNotificationJob failed:', error.message)
  }
}
