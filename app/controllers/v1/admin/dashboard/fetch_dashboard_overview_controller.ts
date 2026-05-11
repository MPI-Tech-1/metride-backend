import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import CustomerActions from '#model_management/actions/customer_actions'
import DriverActions from '#model_management/actions/driver_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'
import { DateTime } from 'luxon'

export default class FetchDashboardOverviewController {
  async handle({ response }: HttpContext) {
    try {
      const [bookings, drivers, customers] = await Promise.all([
        BookingActions.getAdminDashboardBookingStats(),
        DriverActions.getAdminDashboardDriverStats(),
        CustomerActions.getAdminDashboardCustomerStats(),
      ])

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Dashboard overview fetched successfully.',
        results: {
          generatedAt: DateTime.now().toISO(),
          bookings,
          drivers,
          customers,
        },
      })
    } catch (FetchDashboardOverviewControllerError) {
      console.log('FetchDashboardOverviewControllerError -> ', FetchDashboardOverviewControllerError)
      await logApplicationError(FetchDashboardOverviewControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
