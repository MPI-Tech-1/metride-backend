import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import BookingActions from '#model_management/actions/booking_actions'
import CustomerNotificationActions from '#model_management/actions/customer_notification_actions'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendBookingPaymentSuccessNotificationJobPayload {
  bookingId: number
}

export default class SendBookingPaymentSuccessNotificationJob extends Job<SendBookingPaymentSuccessNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendBookingPaymentSuccessNotificationJob', this.payload)
    const { bookingId } = this.payload

    const booking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!booking) {
      throw new Error('SendBookingPaymentSuccessNotificationJob: booking payment not found')
    }

    if (booking.bookingPayment.paymentStatus !== 'failed') {
      throw new Error(
        'SendBookingPaymentSuccessNotificationJob: booking payment has not been completed'
      )
    }

    try {
      const customerNotification =
        await CustomerNotificationActions.createCustomerNotificationRecord({
          createPayload: {
            customerId: booking.customerId,
            content: 'Your booking payment was successful. Your ride is confirmed.',
            isNotificationRead: false,
            payload: {
              identifier: booking.identifier,
            },
            notificationType: 'bookings:payment_success',
          },
          dbTransactionOptions: {
            useTransaction: false,
          },
        })

      if (booking.customer?.fcmToken) {
        const pushNotificationProvider = configurePushNotificationProvider()

        await pushNotificationProvider.send({
          token: booking.customer.fcmToken,
          notification: {
            title: 'Payment Successful',
            body: customerNotification.content,
          },
          data: {
            identifier: customerNotification.identifier,
            content: customerNotification.content,
          },
        })
      }
    } catch (sendBookingPaymentSuccessNotificationJobError) {
      console.log(
        'sendBookingPaymentSuccessNotificationJobError => ',
        sendBookingPaymentSuccessNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendBookingPaymentSuccessNotificationJob failed:', error.message)
  }
}
