import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import VehicleModelActions from '#model_management/actions/vehicle_model_actions'
import VehicleMakeActions from '#model_management/actions/vehicle_make_actions'
import UpdateVehicleModelRequestValidator from '#validators/v1/admin/settings/vehicle_models/update_vehicle_model_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdateVehicleModelController {
  async handle({ request, response, params }: HttpContext) {
    const { identifier } = params
    const { name, vehicleMakeIdentifier } = await request.validateUsing(
      UpdateVehicleModelRequestValidator
    )

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

      const vehicleMake = await VehicleMakeActions.getVehicleMake({
        identifier: vehicleMakeIdentifier,
        identifierType: 'identifier',
      })

      if (!vehicleMake) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Vehicle make not found',
        })
      }

      await VehicleModelActions.updateVehicleModelRecord({
        identifierOptions: {
          identifier,
          identifierType: 'identifier',
        },
        updatePayload: {
          name,
          vehicleMakeId: vehicleMake.id,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Vehicle model updated successfully',
      })
    } catch (UpdateVehicleModelControllerError) {
      console.log('UpdateVehicleModelControllerError -> ', UpdateVehicleModelControllerError)
      await logApplicationError(UpdateVehicleModelControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
