import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import RideTypeActions from '#model_management/actions/ride_type_actions'
import VehicleMakeActions from '#model_management/actions/vehicle_make_actions'
import VehicleModelActions from '#model_management/actions/vehicle_model_actions'
import InvestorVehicleActions from '#model_management/actions/investor_vehicle_actions'
import UpdateInvestorVehicleRequestValidator from '#validators/v1/admin/investment_management/update_investor_vehicle_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdateInvestorVehicleController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()
    const {
      rideTypeIdentifier,
      vehicleMakeIdentifier,
      vehicleModelIdentifier,
      colorOfVehicle,
      plateNumber,
      seatCapacity,
      percentageShare,
    } = await request.validateUsing(UpdateInvestorVehicleRequestValidator)

    try {
      const investorVehicle = await InvestorVehicleActions.getInvestorVehicle({
        identifier,
        identifierType: 'identifier',
      })

      if (!investorVehicle) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Investor vehicle not found',
        })
      }

      const rideType = await RideTypeActions.getRideType({
        identifier: rideTypeIdentifier,
        identifierType: 'identifier',
      })

      if (!rideType) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Ride type not found',
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

      const vehicleModel = await VehicleModelActions.getVehicleModel({
        identifier: vehicleModelIdentifier,
        identifierType: 'identifier',
      })

      if (!vehicleModel) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Vehicle model not found',
        })
      }

      await InvestorVehicleActions.updateInvestorVehicleRecord({
        identifierOptions: { identifier, identifierType: 'identifier' },
        updatePayload: {
          rideTypeId: rideType.id,
          vehicleMakeId: vehicleMake.id,
          vehicleModelId: vehicleModel.id,
          colorOfVehicle,
          plateNumber,
          seatCapacity,
          percentageShare,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Investor vehicle updated successfully',
      })
    } catch (UpdateInvestorVehicleControllerError) {
      console.log('UpdateInvestorVehicleControllerError -> ', UpdateInvestorVehicleControllerError)
      await logApplicationError(UpdateInvestorVehicleControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
