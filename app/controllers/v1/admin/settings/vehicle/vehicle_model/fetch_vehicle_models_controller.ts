import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import VehicleModelActions from '#model_management/actions/vehicle_model_actions'
import VehicleMakeActions from '#model_management/actions/vehicle_make_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class FetchVehicleModelsController {
  async handle({ request, response }: HttpContext) {
    const { vehicleMakeIdentifier } = request.qs()

    try {
      const vehicleMake = await VehicleMakeActions.getVehicleMake({
        identifier: vehicleMakeIdentifier ?? '',
        identifierType: 'identifier',
      })

      const { vehicleModelPayload: vehicleModels } = await VehicleModelActions.listVehicleModels({
        filterRecordOptionsPayload: {
          vehicleMakeId: vehicleMake?.id,
        },
      })

      const mutatedPayload = vehicleModels.map(vehicleModel => {
        return {
          identifier: vehicleModel.identifier,
          name: vehicleModel.name,
          vehicleMake: {
            identifier: vehicleModel.vehicleMake?.identifier,
            name: vehicleModel.vehicleMake?.name,
          }
        }
      })
      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Vehicle models fetched successfully',
        results: {
          vehicleModels: mutatedPayload
        }
      })
    } catch (FetchVehicleModelsControllerError) {
      console.log('FetchVehicleModelsControllerError -> ', FetchVehicleModelsControllerError)
      await logApplicationError(FetchVehicleModelsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
