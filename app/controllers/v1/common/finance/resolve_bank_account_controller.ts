import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import configureBankAccountInfoProvider from '#infrastructure_providers/helpers/configure_bank_account_info_provider'
import ResolveBankAccountInfoRequestValidator from '#validators/v1/common/finance/resolve_bank_account_info_request_validator'
import { type HttpContext } from '@adonisjs/core/http'

export default class ResolveAccountController {
  public async handle({ request, response }: HttpContext) {
    const { accountNumber, bankCode } = await request.validateUsing(
      ResolveBankAccountInfoRequestValidator
    )
    try {
      const bankAccountInfoProvider = configureBankAccountInfoProvider()

      const resolvedAccount = await bankAccountInfoProvider.verifyAccountDetails({
        accountNumber,
        bankCode,
      })

      if (resolvedAccount === null) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Bank account could not be resolved',
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Bank Account Resolved Successfully',
        results: {
          accountName: resolvedAccount.accountName,
          accountNumber: resolvedAccount.accountNumber,
        },
      })
    } catch (ResolveAccountControllerError) {
      console.log(
        '🚀 ~ ResolveAccountController.handle ResolveAccountControllerError ->',
        ResolveAccountControllerError
      )
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
