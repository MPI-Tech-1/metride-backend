import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import VehicleModelActions from '#model_management/actions/vehicle_model_actions'
import VehicleMakeActions from '#model_management/actions/vehicle_make_actions'
import CreateVehicleModelRequestValidator from '#validators/v1/admin/settings/vehicle_models/create_vehicle_model_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class CreateVehicleModelController {
  async handle({ request, response }: HttpContext) {
    const { name, vehicleMakeIdentifier } = await request.validateUsing(
      CreateVehicleModelRequestValidator
    )

    try {
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

      await VehicleModelActions.createVehicleModelRecord({
        createPayload: {
          name,
          vehicleMakeId: vehicleMake.id,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Vehicle model created successfully',
      })
    } catch (CreateVehicleModelControllerError) {
      console.log('CreateVehicleModelControllerError -> ', CreateVehicleModelControllerError)
      await logApplicationError(CreateVehicleModelControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
