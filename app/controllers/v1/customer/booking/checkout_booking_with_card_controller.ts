import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import BookingPaymentActions from '#model_management/actions/booking_payment_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import {
  ERROR,
  METRIDE_ADMIN_DASHBOARD_URL,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import configureCardPaymentProvider from '#infrastructure_providers/helpers/configure_card_payment_provider'
import { randomUUID } from 'node:crypto'
import logApplicationError from '#common/helper_functions/log_application_error'
import PromotionRedemption from '#models/promotion_redemption'
import { DateTime } from 'luxon'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import app from '@adonisjs/core/services/app'
import env from '#start/env'

export default class CheckoutBookingController {
  async handle({ request, auth, response }: HttpContext) {
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

    if (booking.customerId !== auth.use('customer').user!.id) {
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

    const amountDue =
      booking.bookingPayment.amountDue ??
      Math.max(0, booking.bookingPayment.basePrice - booking.bookingPayment.discountAmount)

    if (amountDue === 0) {
      const trx = await db.transaction()
      try {
        booking.bookingPayment.useTransaction(trx)
        booking.bookingPayment.merge({ amountPaid: 0, paymentStatus: 'completed' })
        await booking.bookingPayment.save()
        const redemption = await PromotionRedemption.query({ client: trx })
          .where('booking_id', booking.id)
          .where('status', 'reserved')
          .first()
        if (redemption) {
          redemption.useTransaction(trx)
          redemption.status = 'redeemed'
          redemption.redeemedAt = DateTime.now()
          await redemption.save()
        }
        await trx.commit()
        if (booking.assignedDriverId && booking.paymentTiming === 'pay_now') {
          await NotificationDispatchClient.sendBookingDriverAssignmentNotificationJob({
            bookingId: booking.id,
          })
        }
        return response.status(HttpStatusCodesEnum.OK).send({
          status_code: HttpStatusCodesEnum.OK,
          status: SUCCESS,
          message: 'Booking fully discounted and payment completed.',
          results: { checkoutUrl: null, transactionReference: null },
        })
      } catch (error) {
        await trx.rollback()
        throw error
      }
    }

    if (app.inDev && env.get('DB_CONNECTION', 'mysql') === 'sqlite') {
      const dummyTransactionReference = `dummy-${randomUUID()}`
      const dummyCheckoutUrl = `https://example.com/metride/payment-success?reference=${dummyTransactionReference}`

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Dummy checkout initialized for local development. No payment was recorded.',
        results: {
          isTestData: true,
          checkoutUrl: dummyCheckoutUrl,
          transactionReference: dummyTransactionReference,
          amountDue,
          amountPaid: 0,
          paymentStatus: 'pending',
        },
      })
    }

    const cardPaymentProvider = configureCardPaymentProvider()

    const { transactionStatus, initiateTransactionInformation } =
      await cardPaymentProvider.initiateTransaction({
        amount: `${amountDue}`,
        emailAddress: booking.customer.email,
        redirectTransactionRedirectUrl: `${METRIDE_ADMIN_DASHBOARD_URL}/payment-success`,
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
      await dbTransaction.rollback()
      console.log('CheckoutBookingControllerError -> ', CheckoutBookingControllerError)
      await logApplicationError(CheckoutBookingControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
