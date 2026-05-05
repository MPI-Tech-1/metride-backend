import { type HttpContext } from '@adonisjs/core/http'
import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class GetWalletTransactionController {
  async handle({ params, auth, response }: HttpContext) {
    try {
      const loggedInDriver = auth.use('driver').user!

      const transaction = await DriverWalletTransactionActions.getDriverWalletTransaction({
        identifierType: 'identifier',
        identifier: params.transactionIdentifier,
      })

      if (!transaction || transaction.driverId !== loggedInDriver.id) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Wallet transaction not found.',
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Wallet transaction fetched successfully.',
        results: {
          identifier: transaction.identifier,
          amount: transaction.amount,
          typeOfTransaction: transaction.typeOfTransaction,
          status: transaction.status,
          remark: transaction.remark,
          systemGeneratedTransactionReference: transaction.systemGeneratedTransactionReference,
          providerTransactionReference: transaction.providerTransactionReference,
          createdAt: transaction.createdAt,
        },
      })
    } catch (GetWalletTransactionControllerError) {
      console.log('GetWalletTransactionControllerError -> ', GetWalletTransactionControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
