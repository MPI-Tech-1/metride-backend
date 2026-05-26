import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import BookingActions from '#model_management/actions/booking_actions'
import DriverWalletActions from '#model_management/actions/driver_wallet_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class FetchBookingsMetricsController {
  async handle({ auth, response }: HttpContext) {
    try {
      const loggedInDriver = auth.use('driver').user!

      const [totalNumberOfCompletedBookings, totalEarnings, wallet] = await Promise.all([
        BookingActions.getTotalDriverCompletedBookings(loggedInDriver.id),
        BookingActions.getTotalDriverBookingEarnings(loggedInDriver.id),
        DriverWalletActions.getDriverWallet({ identifierType: 'driverId', identifier: loggedInDriver.id }),
      ])

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Booking metrics fetched successfully.',
        results: {
          totalEarnings,
          totalNumberOfCompletedBookings,
          walletBalance: wallet?.balance ?? 0,
        },
      })
    } catch (FetchBookingsMetricsControllerError) {
      console.log('FetchBookingsMetricsControllerError -> ', FetchBookingsMetricsControllerError)
      await logApplicationError(FetchBookingsMetricsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
