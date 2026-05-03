import configureCardPaymentProvider from '#infrastructure_providers/helpers/configure_card_payment_provider'
import BookingPaymentActions from '#model_management/actions/booking_payment_actions'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface ProcessBookingPaymentJobPayload {
  paymentProviderReference: string
}

export default class ProcessBookingPaymentJob extends Job<ProcessBookingPaymentJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing ProcessBookingPaymentJob', this.payload)

    const { paymentProviderReference } = this.payload

    const bookingPayment = await BookingPaymentActions.getBookingPayment({
      identifierType: 'paymentProviderReference',
      identifier: paymentProviderReference,
    })

    if (!bookingPayment) {
      throw new Error(
        `ProcessBookingPaymentJob: booking payment not found for reference ${paymentProviderReference}`
      )
    }

    const cardPaymentProvider = configureCardPaymentProvider()

    const { transactionStatus } =
      await cardPaymentProvider.verifyTransaction(paymentProviderReference)

    if (transactionStatus === 'success') {
      await BookingPaymentActions.updateBookingPaymentRecord({
        identifierOptions: {
          identifierType: 'id',
          identifier: bookingPayment.id,
        },
        updatePayload: {
          paymentStatus: 'completed',
        },
        dbTransactionOptions: { useTransaction: false },
      })

      await NotificationDispatchClient.sendBookingPaymentSuccessNotificationJob({
        bookingId: bookingPayment.bookingId,
      })

      return
    }

    if (transactionStatus === 'failed') {
      await BookingPaymentActions.updateBookingPaymentRecord({
        identifierOptions: {
          identifierType: 'id',
          identifier: bookingPayment.id,
        },
        updatePayload: {
          paymentStatus: 'failed',
        },
        dbTransactionOptions: {
          useTransaction: false,
        },
      })

      await NotificationDispatchClient.sendBookingPaymentFailedNotificationJob({
        bookingId: bookingPayment.bookingId,
      })

      return
    }

    await BookingPaymentActions.updateBookingPaymentRecord({
      identifierOptions: {
        identifierType: 'id',
        identifier: bookingPayment.id,
      },
      updatePayload: {
        paymentStatus: 'pending',
      },
      dbTransactionOptions: {
        useTransaction: false,
      },
    })
  }

  async failed(error: Error) {
    console.error('ProcessBookingPaymentJob failed:', error.message)
  }
}
