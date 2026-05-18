import { type HttpContext } from '@adonisjs/core/http'
import ListActiveDriversRequestValidator from '#validators/v1/admin/driver_management/list_active_drivers_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'
import DriverActions from '#model_management/actions/driver_actions'

export default class FetchActiveDriversController {
  async handle({ request, response }: HttpContext) {
    const { page = 1, limit = 10 } = await request.validateUsing(ListActiveDriversRequestValidator)

    try {
      const { driverPayload: drivers, paginationMeta } = await DriverActions.listDrivers({
        filterRecordOptionsPayload: {
          isDriverActiveForTrip: true,
        },
        paginationPayload: {
          page,
          limit,
        },
      })

      const mutatedDrivers = drivers.map((driver) => {
        const mutatedLocations = driver.driverLocations.map((driverLocation) => {
          return {
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
          }
        })

        return {
          identifier: driver.identifier,
          fullName: driver.fullName,
          currentLocation: mutatedLocations[0] ?? null,
        }
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Active drivers fetched successfully.',
        results: {
          drivers: mutatedDrivers,
          paginationMeta,
        },
      })
    } catch (FetchActiveDriversControllerError) {
      console.log('FetchActiveDriversControllerError -> ', FetchActiveDriversControllerError)
      await logApplicationError(FetchActiveDriversControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
