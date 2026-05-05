import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchBookingMetricsController {
  async handle({ response }: HttpContext) {
    try {
      const {
        totalBookingsForPastMonth,
        totalCompletedBookingsForPastMonth,
        totalCancelledBookingsForPastMonth,
      } = await BookingActions.getBookingMetrics()

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Booking metrics fetched successfully.',
        results: {
          totalBookingsForPastMonth,
          totalCompletedBookingsForPastMonth,
          totalCancelledBookingsForPastMonth,
        },
      })
    } catch (FetchBookingMetricsControllerError) {
      console.log('FetchBookingMetricsControllerError -> ', FetchBookingMetricsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
