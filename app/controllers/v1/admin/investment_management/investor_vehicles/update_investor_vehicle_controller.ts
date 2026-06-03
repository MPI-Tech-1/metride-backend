import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorVehicleActions from '#model_management/actions/investor_vehicle_actions'
import UpdateInvestorVehicleRequestValidator from '#validators/v1/admin/investment_management/update_investor_vehicle_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdateInvestorVehicleController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()
    const { investorId, vehicleName, vehicleType, plateNumber, investmentAmount, percentageShare } =
      await request.validateUsing(UpdateInvestorVehicleRequestValidator)

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

      await InvestorVehicleActions.updateInvestorVehicleRecord({
        identifierOptions: { identifier, identifierType: 'identifier' },
        updatePayload: {
          investorId,
          vehicleName,
          vehicleType,
          plateNumber,
          investmentAmount,
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
