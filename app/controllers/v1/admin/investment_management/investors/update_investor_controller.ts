import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorActions from '#model_management/actions/investor_actions'
import UpdateInvestorRequestValidator from '#validators/v1/admin/investment_management/update_investor_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdateInvestorController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()
    const { firstName, lastName, email, mobileNumber, address } = await request.validateUsing(
      UpdateInvestorRequestValidator
    )

    try {
      const investor = await InvestorActions.getInvestor({
        identifier,
        identifierType: 'identifier',
      })

      if (!investor) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Investor not found',
        })
      }

      await InvestorActions.updateInvestorRecord({
        identifierOptions: { identifier, identifierType: 'identifier' },
        updatePayload: { firstName, lastName, email, mobileNumber, address },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Investor updated successfully',
      })
    } catch (UpdateInvestorControllerError) {
      console.log('UpdateInvestorControllerError -> ', UpdateInvestorControllerError)
      await logApplicationError(UpdateInvestorControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
