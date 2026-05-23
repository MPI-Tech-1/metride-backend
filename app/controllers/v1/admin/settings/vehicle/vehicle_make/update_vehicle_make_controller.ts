import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import VehicleMakeActions from '#model_management/actions/vehicle_make_actions'
import UpdateVehicleMakeRequestValidator from '#validators/v1/admin/settings/vehicle_makes/update_vehicle_make_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdateVehicleMakeController {
  async handle({ request, response, params }: HttpContext) {
    const { identifier } = params
    const { name } = await request.validateUsing(UpdateVehicleMakeRequestValidator)

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

      await VehicleMakeActions.updateVehicleMakeRecord({
        identifierOptions: {
          identifier,
          identifierType: 'identifier',
        },
        updatePayload: {
          name,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Vehicle make updated successfully',
      })
    } catch (UpdateVehicleMakeControllerError) {
      console.log('UpdateVehicleMakeControllerError -> ', UpdateVehicleMakeControllerError)
      await logApplicationError(UpdateVehicleMakeControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
