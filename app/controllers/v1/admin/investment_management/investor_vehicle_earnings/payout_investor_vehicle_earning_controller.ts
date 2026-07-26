import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorVehicleEarningActions from '#model_management/actions/investor_vehicle_earning_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class PayoutInvestorVehicleEarningController {
  async handle({ request, response }: HttpContext) {
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

      if (earning.status === 'paid') {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'This earning has already been paid out',
        })
      }

      await InvestorVehicleEarningActions.payoutInvestorVehicleEarning({
        identifier,
        identifierType: 'identifier',
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Investor vehicle earning paid out successfully',
      })
    } catch (PayoutInvestorVehicleEarningControllerError) {
      console.log(
        'PayoutInvestorVehicleEarningControllerError -> ',
        PayoutInvestorVehicleEarningControllerError
      )
      await logApplicationError(PayoutInvestorVehicleEarningControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
