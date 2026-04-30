import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import VehicleModelActions from '#model_management/actions/vehicle_model_actions'
import FetchVehicleModelsRequestValidator from '#validators/v1/common/vehicle/fetch_vehicle_models_request_validator'
import VehicleMakeActions from '#model_management/actions/vehicle_make_actions'

export default class FetchVehicleModelsController {
  async handle({ request, response }: HttpContext) {
    const { vehicleMakeIdentifier } = await request.validateUsing(
      FetchVehicleModelsRequestValidator
    )

    try {
      const vehicleMake = await VehicleMakeActions.getVehicleMake({
        identifierType: 'identifier',
        identifier: vehicleMakeIdentifier ?? '',
      })

      const { vehicleModelPayload: vehicleModels } = await VehicleModelActions.listVehicleModels({
        filterRecordOptionsPayload: {
          vehicleMakeId: vehicleMake?.id,
        },
      })

      const mutatedPayload = vehicleModels.map((vehicleModel) => {
        return {
          identifier: vehicleModel.identifier,
          vehicleMake: {
            identifier: vehicleModel.vehicleMake.identifier,
            name: vehicleModel.vehicleMake.name,
          },
          name: vehicleModel.name,
        }
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of vehicle models successfully',
        results: mutatedPayload,
      })
    } catch (FetchVehicleModelsControllerError) {
      console.log('FetchVehicleModelsControllerError -> ', FetchVehicleModelsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
