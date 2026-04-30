import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import BookingPaymentActions from '#model_management/actions/booking_payment_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import configureCardPaymentProvider from '#infrastructure_providers/helpers/configure_card_payment_provider'
import { randomUUID } from 'node:crypto'

export default class CheckoutBookingController {
  async handle({ request, response }: HttpContext) {
    const { bookingIdentifier } = request.params()

    const booking = await BookingActions.getBooking({
      identifierType: 'identifier',
      identifier: bookingIdentifier,
    })

    if (!booking) {
      return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
        status_code: HttpStatusCodesEnum.NOT_FOUND,
        status: ERROR,
        message: 'Booking not found',
      })
    }

    if (booking.bookingPayment.paymentStatus !== 'pending') {
      return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        status: ERROR,
        message:
          booking.bookingPayment.paymentStatus === 'failed'
            ? 'Booking payment failed. You need to create another booking'
            : 'Booking has already been paid',
      })
    }

    const cardPaymentProvider = configureCardPaymentProvider()

    const { transactionStatus, initiateTransactionInformation } =
      await cardPaymentProvider.initiateTransaction({
        amount: `${booking.bookingPayment.basePrice}`,
        paymentChannel: ['card'],
        emailAddress: booking.customer.email,
      })

    if (transactionStatus !== 'success') {
      return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        status: ERROR,
        message: 'Initiate Transaction failed',
      })
    }

    const dbTransaction = await db.transaction()

    try {
      await BookingPaymentActions.updateBookingPaymentRecord({
        identifierOptions: {
          identifier: booking.bookingPayment.id,
          identifierType: 'id',
        },
        updatePayload: {
          systemGeneratedProviderReference: randomUUID(),
          paymentProviderReference: initiateTransactionInformation?.transactionReference,
          amountPaid: 0,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await dbTransaction.commit()

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Checkout successful',
        results: {
          checkoutUrl: initiateTransactionInformation?.checkoutUrl,
          transactionReference: initiateTransactionInformation?.transactionReference,
        },
      })
    } catch (CheckoutBookingControllerError) {
      console.log('CheckoutBookingControllerError -> ', CheckoutBookingControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
