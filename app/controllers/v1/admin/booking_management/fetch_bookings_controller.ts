import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import ListBookingsRequestValidator from '#validators/v1/admin/booking_management/list_bookings_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchBookingsController {
  async handle({ request, response }: HttpContext) {
    const { page, limit, searchQuery, rideTypeId, typeOfBooking, isRecurringBooking } = await request.validateUsing(ListBookingsRequestValidator)

    try {
      const { bookingPayload, paginationMeta } = await BookingActions.listBookings({
        filterRecordOptionsPayload: {
          searchQuery,
          rideTypeId,
          typeOfBooking,
          isRecurringBooking,
        },
        paginationPayload: {
          page: page || 1,
          limit: limit || 10,
        },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Bookings fetched successfully.',
        results: {
          data: bookingPayload,
          meta: paginationMeta,
        },
      })
    } catch (FetchBookingsControllerError) {
      console.log('FetchBookingsControllerError -> ', FetchBookingsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
