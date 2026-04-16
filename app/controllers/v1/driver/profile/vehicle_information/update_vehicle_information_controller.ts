import { HttpContext } from '@adonisjs/core/http'
import DriverVehicleActions from '#model_management/actions/driver_vehicle_actions'
import UpdateVehicleInformationRequestValidator from '#validators/v1/driver/profile/vehicle_information/update_vehicle_information_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class UpdateVehicleInformationController {
  async handle({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(UpdateVehicleInformationRequestValidator)

    try {
      const loggedDriver = auth.use('driver').user!

      const vehicleInformation = await DriverVehicleActions.updateDriverVehicleRecord({
        identifierOptions: { identifier: loggedDriver.id, identifierType: 'driverId' },
        updatePayload: payload,
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Vehicle information updated successfully.',
        results: vehicleInformation,
      })
    } catch (UpdateVehicleInformationControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
