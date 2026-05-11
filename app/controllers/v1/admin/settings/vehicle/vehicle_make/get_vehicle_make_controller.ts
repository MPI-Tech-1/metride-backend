import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import VehicleMakeActions from '#model_management/actions/vehicle_make_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class GetVehicleMakeController {
  async handle({ response, params }: HttpContext) {
    const { identifier } = params

    try {
      const vehicleMake = await VehicleMakeActions.getVehicleMake({
        identifier,
        identifierType: 'identifier',
      })

      if (!vehicleMake) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Vehicle make not found',
        })
      }

      const mutatedPayload = {
        identifier: vehicleMake.identifier,
        name: vehicleMake.name
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Vehicle make fetched successfully',
        results: mutatedPayload
      })
    } catch (GetVehicleMakeControllerError) {
      console.log('GetVehicleMakeControllerError -> ', GetVehicleMakeControllerError)
      await logApplicationError(GetVehicleMakeControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
