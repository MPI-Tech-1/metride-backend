import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import SubmitBookingReviewRequestValidator from '#validators/v1/customer/booking/submit_booking_review_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'
import BookingReviewActions from '#model_management/actions/booking_review_actions'

export default class SubmitBookingReviewController {
  async handle({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(SubmitBookingReviewRequestValidator)

    const loggedInCustomer = auth.use('customer').user!

    const { rating, review } = payload
    try {
      const { bookingIdentifier } = request.params()

      const booking = await BookingActions.getBooking({
        identifier: bookingIdentifier,
        identifierType: 'identifier',
      })

      if (!booking || booking.customerId !== loggedInCustomer.id) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status: ERROR,
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          message: 'Booking not found',
        })
      }

      if (booking.status !== 'completed') {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status: ERROR,
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          message: 'Booking status must be completed before submitting a review',
        })
      }

      await BookingReviewActions.createBookingReviewRecord({
        createPayload: {
          bookingId: booking.id,
          customerId: booking.customerId,
          driverId: booking.assignedDriverId!,
          rating,
          review,
        },
        dbTransactionOptions: {
          useTransaction: false,
        },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Booking Review was submitted successfully',
      })
    } catch (SubmitBookingReviewControllerError) {
      console.log('SubmitBookingReviewControllerError -> ', SubmitBookingReviewControllerError)
      await logApplicationError(SubmitBookingReviewControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
