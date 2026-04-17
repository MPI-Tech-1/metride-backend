import { HttpContext } from '@adonisjs/core/http'
import DriverVehicleActions from '#model_management/actions/driver_vehicle_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class GetVehicleInformationController {
  async handle({ response, auth }: HttpContext) {
    try {
      const loggedInDriver = auth.use('driver').user!

      const vehicleInformation = await DriverVehicleActions.getDriverVehicle({
        identifier: loggedInDriver.id,
        identifierType: 'driverId',
      })

      const mutatedResponse = {
        identifier: vehicleInformation?.identifier,

        vehicleMake: vehicleInformation?.vehicleMake
          ? {
              identifier: vehicleInformation?.vehicleMake.identifier,
              name: vehicleInformation?.vehicleMake.name,
            }
          : null,
        vehicleModel: vehicleInformation?.vehicleModel
          ? {
              identifier: vehicleInformation?.vehicleModel.identifier,
              name: vehicleInformation?.vehicleModel.name,
            }
          : null,
        colorOfVehicle: vehicleInformation?.colorOfVehicle,
        plateNumber: vehicleInformation?.plateNumber,
        seatCapacity: vehicleInformation?.seatCapacity,
        typeOfVehicle: vehicleInformation?.typeOfVehicle,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Vehicle information retrieved successfully.',
        results: mutatedResponse,
      })
    } catch (GetVehicleInformationControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
