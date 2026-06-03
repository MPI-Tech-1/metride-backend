import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorActions from '#model_management/actions/investor_actions'
import CreateInvestorRequestValidator from '#validators/v1/admin/investment_management/create_investor_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class CreateInvestorController {
  async handle({ request, response }: HttpContext) {
    const { firstName, lastName, email, mobileNumber, address } = await request.validateUsing(
      CreateInvestorRequestValidator
    )

    try {
      await InvestorActions.createInvestorRecord({
        createPayload: {
          firstName,
          lastName,
          email,
          mobileNumber,
          address: address ?? null,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Investor created successfully',
      })
    } catch (CreateInvestorControllerError) {
      console.log('CreateInvestorControllerError -> ', CreateInvestorControllerError)
      await logApplicationError(CreateInvestorControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
