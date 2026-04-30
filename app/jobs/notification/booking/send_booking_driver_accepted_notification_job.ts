import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import BookingActions from '#model_management/actions/booking_actions'
import CustomerNotificationActions from '#model_management/actions/customer_notification_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendBookingDriverAcceptedNotificationJobPayload {
  bookingId: number
}

export default class SendBookingDriverAcceptedNotificationJob extends Job<SendBookingDriverAcceptedNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendBookingDriverAcceptedNotificationJob', this.payload)
    const { bookingId } = this.payload

    const booking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!booking) {
      throw new Error('SendBookingDriverAcceptedNotificationJob: booking not found')
    }

    if (booking.status !== 'accepted') {
      throw new Error(
        'SendBookingDriverAcceptedNotificationJob: booking has not been accepted by a driver'
      )
    }

    const dbTransaction = await db.transaction()

    try {
      const customerNotification =
        await CustomerNotificationActions.createCustomerNotificationRecord({
          createPayload: {
            customerId: booking.customerId,
            content: 'Your driver has accepted your booking and is on the way.',
            isNotificationRead: false,
            payload: {
              identifier: booking.identifier,
            },
            notificationType: 'bookings:driver_accepted',
          },
          dbTransactionOptions: { dbTransaction, useTransaction: true },
        })

      await dbTransaction.commit()

      if (booking.customer.fcmToken) {
        const pushNotificationProvider = configurePushNotificationProvider()

        await pushNotificationProvider.send({
          token: booking.customer.fcmToken!,
          notification: {
            title: 'Driver Accepted Your Ride',
            body: customerNotification.content,
          },
          data: {
            identifier: customerNotification.identifier,
            content: customerNotification.content,
          },
        })
      }
    } catch (sendBookingDriverAcceptedNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendBookingDriverAcceptedNotificationJobError => ',
        sendBookingDriverAcceptedNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendBookingDriverAcceptedNotificationJob failed:', error.message)
  }
}
