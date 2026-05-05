import { type HttpContext } from '@adonisjs/core/http'
import DriverActions from '#model_management/actions/driver_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchDriverMetricsController {
  async handle({ response }: HttpContext) {
    try {
      const {
        totalNumberOfTrips,
        totalAcceptanceRate,
        totalNumberOfActiveDrivers,
        totalCancellationRate,
      } = await DriverActions.getDriverMetrics()

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver metrics fetched successfully.',
        results: {
          totalNumberOfTrips,
          totalAcceptanceRate,
          totalNumberOfActiveDrivers,
          totalCancellationRate,
        },
      })
    } catch (FetchDriverMetricsControllerError) {
      console.log('FetchDriverMetricsControllerError -> ', FetchDriverMetricsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
