import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import VehicleModelActions from '#model_management/actions/vehicle_model_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class GetVehicleModelController {
  async handle({ response, params }: HttpContext) {
    const { identifier } = params

    try {
      const vehicleModel = await VehicleModelActions.getVehicleModel({
        identifier,
        identifierType: 'identifier',
      })

      if (!vehicleModel) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Vehicle model not found',
        })
      }

      const mutatedPayload = {
        identifier: vehicleModel.identifier,
        name: vehicleModel.name,
        vehicleMake: {
          identifier: vehicleModel.vehicleMake?.identifier,
          name: vehicleModel.vehicleMake?.name,
        },
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Vehicle model fetched successfully',
        results: mutatedPayload,
      })
    } catch (GetVehicleModelControllerError) {
      console.log('GetVehicleModelControllerError -> ', GetVehicleModelControllerError)
      await logApplicationError(GetVehicleModelControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
