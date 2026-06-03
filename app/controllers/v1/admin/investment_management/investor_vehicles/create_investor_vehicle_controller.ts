import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorActions from '#model_management/actions/investor_actions'
import RideTypeActions from '#model_management/actions/ride_type_actions'
import VehicleMakeActions from '#model_management/actions/vehicle_make_actions'
import VehicleModelActions from '#model_management/actions/vehicle_model_actions'
import InvestorVehicleActions from '#model_management/actions/investor_vehicle_actions'
import CreateInvestorVehicleRequestValidator from '#validators/v1/admin/investment_management/create_investor_vehicle_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class CreateInvestorVehicleController {
  async handle({ request, response }: HttpContext) {
    const {
      investorIdentifier,
      rideTypeIdentifier,
      vehicleMakeIdentifier,
      vehicleModelIdentifier,
      colorOfVehicle,
      plateNumber,
      seatCapacity,
      percentageShare,
    } = await request.validateUsing(CreateInvestorVehicleRequestValidator)

    try {
      const investor = await InvestorActions.getInvestor({
        identifier: investorIdentifier,
        identifierType: 'identifier',
      })

      if (!investor) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Investor not found',
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

      await InvestorVehicleActions.createInvestorVehicleRecord({
        createPayload: {
          investorId: investor.id,
          rideTypeId: rideType.id,
          vehicleMakeId: vehicleMake.id,
          vehicleModelId: vehicleModel.id,
          colorOfVehicle: colorOfVehicle ?? null,
          plateNumber: plateNumber ?? null,
          seatCapacity,
          percentageShare,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Investor vehicle created successfully',
      })
    } catch (CreateInvestorVehicleControllerError) {
      console.log('CreateInvestorVehicleControllerError -> ', CreateInvestorVehicleControllerError)
      await logApplicationError(CreateInvestorVehicleControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
