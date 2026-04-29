import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import VehicleMakeActions from '#model_management/actions/vehicle_make_actions'

export default class FetchVehicleMakesControllers {
  async handle({ response }: HttpContext) {
    try {
      const { vehicleMakePayload: vehicleMakes } = await VehicleMakeActions.listVehicleMakes({})

      const mutatedPayload = vehicleMakes.map((vehicleMake) => {
        return {
          identifier: vehicleMake.identifier,
          name: vehicleMake.name,
        }
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of vehicle makes successfully',
        results: mutatedPayload,
      })
    } catch (FetchVehicleMakesControllersError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
