import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import VehicleMakeActions from '#model_management/actions/vehicle_make_actions'
import CreateVehicleMakeRequestValidator from '#validators/v1/admin/settings/vehicle_makes/create_vehicle_make_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class CreateVehicleMakeController {
  async handle({ request, response }: HttpContext) {
    const { name } = await request.validateUsing(CreateVehicleMakeRequestValidator)

    try {
      await VehicleMakeActions.createVehicleMakeRecord({
        createPayload: {
          name,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Vehicle make created successfully',
      })
    } catch (CreateVehicleMakeControllerError) {
      console.log('CreateVehicleMakeControllerError -> ', CreateVehicleMakeControllerError)
      await logApplicationError(CreateVehicleMakeControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
