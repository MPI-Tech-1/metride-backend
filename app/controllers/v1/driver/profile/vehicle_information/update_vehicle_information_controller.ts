import { type HttpContext } from '@adonisjs/core/http'
import DriverVehicleActions from '#model_management/actions/driver_vehicle_actions'
import UpdateVehicleInformationRequestValidator from '#validators/v1/driver/profile/vehicle_information/update_vehicle_information_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import DriverRegistrationStepActions from '#model_management/actions/driver_registration_step_actions'
import VehicleModelActions from '#model_management/actions/vehicle_model_actions'

export default class UpdateVehicleInformationController {
  async handle({ request, response, auth }: HttpContext) {
    const { vehicleModelIdentifier, typeOfVehicle, colorOfVehicle, plateNumber, seatCapacity } =
      await request.validateUsing(UpdateVehicleInformationRequestValidator)

    const dbTransaction = await db.transaction()
    try {
      const loggedInDriver = auth.use('driver').user!

      const vehicleModel = await VehicleModelActions.getVehicleModel({
        identifierType: 'identifier',
        identifier: vehicleModelIdentifier,
      })

      await DriverVehicleActions.updateDriverVehicleRecord({
        identifierOptions: { identifier: loggedInDriver.id, identifierType: 'driverId' },
        updatePayload: {
          vehicleModelId: vehicleModel?.id,
          vehicleMakeId: vehicleModel?.vehicleMakeId,
          typeOfVehicle,
          colorOfVehicle,
          plateNumber,
          seatCapacity,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverRegistrationStepActions.updateDriverRegistrationStepRecord({
        identifierOptions: {
          identifierType: 'driverId',
          identifier: loggedInDriver.id,
        },
        updatePayload: {
          hasProvidedVehicleInformation: true,
        },
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
      })

      await dbTransaction.commit()
      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Vehicle information updated successfully.',
      })
    } catch (UpdateVehicleInformationControllerError) {
      await dbTransaction.rollback()
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
