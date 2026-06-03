import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorVehicleEarningActions from '#model_management/actions/investor_vehicle_earning_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class GetInvestorVehicleEarningController {
  async handle({ response, request }: HttpContext) {
    const { identifier } = request.params()

    try {
      const earning = await InvestorVehicleEarningActions.getInvestorVehicleEarning({
        identifier,
        identifierType: 'identifier',
      })

      if (!earning) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Investor vehicle earning not found',
        })
      }

      const mutatedEarning = {
        identifier: earning.identifier,
        investorVehicleId: earning.investorVehicleId,
        investorVehicle: earning.investorVehicle
          ? {
              identifier: earning.investorVehicle.identifier,
              plateNumber: earning.investorVehicle.plateNumber,
              colorOfVehicle: earning.investorVehicle.colorOfVehicle,
              seatCapacity: earning.investorVehicle.seatCapacity,
              percentageShare: earning.investorVehicle.percentageShare,
              rideType: earning.investorVehicle.rideType
                ? {
                    identifier: earning.investorVehicle.rideType.identifier,
                    name: earning.investorVehicle.rideType.name,
                  }
                : null,
              vehicleMake: earning.investorVehicle.vehicleMake
                ? {
                    identifier: earning.investorVehicle.vehicleMake.identifier,
                    name: earning.investorVehicle.vehicleMake.name,
                  }
                : null,
              vehicleModel: earning.investorVehicle.vehicleModel
                ? {
                    identifier: earning.investorVehicle.vehicleModel.identifier,
                    name: earning.investorVehicle.vehicleModel.name,
                  }
                : null,
              investor: earning.investorVehicle.investor
                ? {
                    identifier: earning.investorVehicle.investor.identifier,
                    fullName: earning.investorVehicle.investor.fullName,
                  }
                : null,
            }
          : null,
        amount: earning.amount,
        status: earning.status,
        description: earning.description,
        paidAt: earning.paidAt,
        createdAt: earning.createdAt,
        updatedAt: earning.updatedAt,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Investor vehicle earning fetched successfully',
        results: mutatedEarning,
      })
    } catch (GetInvestorVehicleEarningControllerError) {
      console.log(
        'GetInvestorVehicleEarningControllerError -> ',
        GetInvestorVehicleEarningControllerError
      )
      await logApplicationError(GetInvestorVehicleEarningControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
