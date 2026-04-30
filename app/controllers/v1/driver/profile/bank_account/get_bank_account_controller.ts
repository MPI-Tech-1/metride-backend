import { type HttpContext } from '@adonisjs/core/http'
import DriverBankAccountActions from '#model_management/actions/driver_bank_account_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class GetBankAccountController {
  async handle({ response, auth }: HttpContext) {
    try {
      const loggedInDriver = auth.use('driver').user!

      const bankAccount = await DriverBankAccountActions.getDriverBankAccount({
        identifier: loggedInDriver.id,
        identifierType: 'driverId',
      })

      const mutatedResponse = {
        identifier: bankAccount?.identifier,

        bank: bankAccount?.bankId
          ? {
              identifier: bankAccount?.bank.identifier,
              name: bankAccount?.bank.name,
            }
          : null,
        accountName: bankAccount?.accountName,

        accountNumber: bankAccount?.accountNumber,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Bank account retrieved successfully.',
        results: mutatedResponse,
      })
    } catch (GetBankAccountControllerError) {
      console.log('GetBankAccountControllerError -> ', GetBankAccountControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
