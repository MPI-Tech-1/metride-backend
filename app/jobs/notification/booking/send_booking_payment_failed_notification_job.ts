import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import BookingActions from '#model_management/actions/booking_actions'
import CustomerNotificationActions from '#model_management/actions/customer_notification_actions'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendBookingPaymentFailedNotificationJobPayload {
  bookingId: number
}

export default class SendBookingPaymentFailedNotificationJob extends Job<SendBookingPaymentFailedNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendBookingPaymentFailedNotificationJob', this.payload)
    const { bookingId } = this.payload

    const booking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!booking) {
      throw new Error('SendBookingPaymentFailedNotificationJob: booking payment not found')
    }

    if (booking.bookingPayment.paymentStatus !== 'failed') {
      throw new Error('SendBookingPaymentFailedNotificationJob: booking payment has not failed')
    }

    try {
      const customerNotification =
        await CustomerNotificationActions.createCustomerNotificationRecord({
          createPayload: {
            customerId: booking.customerId,
            content:
              'Your booking payment was unsuccessful. Please try again or use a different payment method.',
            isNotificationRead: false,
            payload: {
              identifier: booking.identifier,
            },
            notificationType: 'bookings:payment_failed',
          },
          dbTransactionOptions: { useTransaction: false },
        })

      if (booking.customer?.fcmToken) {
        const pushNotificationProvider = configurePushNotificationProvider()

        await pushNotificationProvider.send({
          token: booking.customer.fcmToken,
          notification: {
            title: 'Payment Failed',
            body: customerNotification.content,
          },
          data: {
            identifier: customerNotification.identifier,
            content: customerNotification.content,
          },
        })
      }
    } catch (sendBookingPaymentFailedNotificationJobError) {
      console.log(
        'sendBookingPaymentFailedNotificationJobError => ',
        sendBookingPaymentFailedNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendBookingPaymentFailedNotificationJob failed:', error.message)
  }
}
