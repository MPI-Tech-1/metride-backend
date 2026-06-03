import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorVehicleActions from '#model_management/actions/investor_vehicle_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class GetInvestorVehicleController {
  async handle({ response, request }: HttpContext) {
    const { identifier } = request.params()

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

      const mutatedInvestorVehicle = {
        identifier: investorVehicle.identifier,
        investorId: investorVehicle.investorId,
        investor: investorVehicle.investor
          ? {
              identifier: investorVehicle.investor.identifier,
              firstName: investorVehicle.investor.firstName,
              lastName: investorVehicle.investor.lastName,
              fullName: investorVehicle.investor.fullName,
              email: investorVehicle.investor.email,
            }
          : null,
        vehicleName: investorVehicle.vehicleName,
        vehicleType: investorVehicle.vehicleType,
        plateNumber: investorVehicle.plateNumber,
        investmentAmount: investorVehicle.investmentAmount,
        percentageShare: investorVehicle.percentageShare,
        createdAt: investorVehicle.createdAt,
        updatedAt: investorVehicle.updatedAt,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Investor vehicle fetched successfully',
        results: mutatedInvestorVehicle,
      })
    } catch (GetInvestorVehicleControllerError) {
      console.log(
        'GetInvestorVehicleControllerError -> ',
        GetInvestorVehicleControllerError
      )
      await logApplicationError(GetInvestorVehicleControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
