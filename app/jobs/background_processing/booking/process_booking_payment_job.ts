import configureCardPaymentProvider from '#infrastructure_providers/helpers/configure_card_payment_provider'
import BookingPaymentActions from '#model_management/actions/booking_payment_actions'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import logApplicationError from '#common/helper_functions/log_application_error'
import logBookingUpdatePayload from '#common/helper_functions/log_booking_update_payload'
import BookingActions from '#model_management/actions/booking_actions'
import createBookingSlackEventPayload from '#common/helper_functions/create_booking_slack_event_payload'
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

    const { transactionStatus, transactionVerificationInformation } =
      await cardPaymentProvider.verifyTransaction(paymentProviderReference)

    if (transactionStatus === 'success') {
      const previousPaymentStatus = bookingPayment.paymentStatus

      await BookingPaymentActions.updateBookingPaymentRecord({
        identifierOptions: {
          identifierType: 'id',
          identifier: bookingPayment.id,
        },
        updatePayload: {
          amountPaid: transactionVerificationInformation?.amount,
          paymentStatus: 'completed',
        },
        dbTransactionOptions: { useTransaction: false },
      })

      // pay-on-arrival rides already notified the driver at creation, so only the
      // pay-now flow uses payment success as the trigger for driver assignment.
      if (
        bookingPayment.booking.assignedDriverId &&
        bookingPayment.booking.paymentTiming === 'pay_now'
      ) {
        await NotificationDispatchClient.sendBookingDriverAssignmentNotificationJob({
          bookingId: bookingPayment.bookingId,
        })
      }

      if (previousPaymentStatus !== 'completed') {
        const booking = await BookingActions.getBooking({
          identifierType: 'id',
          identifier: bookingPayment.bookingId,
        })

        if (booking) {
          await logBookingUpdatePayload(
            createBookingSlackEventPayload({
              eventType: 'payment_completed',
              booking,
              summary: `Payment has been completed for booking ${booking.identifier}.`,
              metadata: {
                paymentProviderReference,
                verifiedStatus: transactionStatus,
              },
            })
          )
        }
      }

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
    await logApplicationError(error)
  }
}
