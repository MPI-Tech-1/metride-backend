import { type HttpContext } from '@adonisjs/core/http'
import DriverBankAccountActions from '#model_management/actions/driver_bank_account_actions'
import UpdateBankAccountRequestValidator from '#validators/v1/driver/profile/bank_account/update_bank_account_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import BankActions from '#model_management/actions/bank_actions'
import db from '@adonisjs/lucid/services/db'
import DriverRegistrationStepActions from '#model_management/actions/driver_registration_step_actions'

export default class UpdateBankAccountController {
  async handle({ request, response, auth }: HttpContext) {
    const { accountName, accountNumber, bankIdentifier } = await request.validateUsing(
      UpdateBankAccountRequestValidator
    )

    const dbTransaction = await db.transaction()
    try {
      const loggedInDriver = auth.use('driver').user!

      const bank = await BankActions.getBank({
        identifierType: 'identifier',
        identifier: bankIdentifier,
      })

      await DriverBankAccountActions.updateDriverBankAccountRecord({
        identifierOptions: { identifier: loggedInDriver.id, identifierType: 'driverId' },
        updatePayload: {
          bankId: bank?.id,
          accountName,
          accountNumber,
        },
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
      })

      await DriverRegistrationStepActions.updateDriverRegistrationStepRecord({
        identifierOptions: {
          identifierType: 'driverId',
          identifier: loggedInDriver.id,
        },
        updatePayload: {
          hasProvidedBankAccount: true,
        },
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
      })

      await dbTransaction.commit()
      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Bank account updated successfully.',
      })
    } catch (UpdateBankAccountControllerError) {
      await dbTransaction.rollback()
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
