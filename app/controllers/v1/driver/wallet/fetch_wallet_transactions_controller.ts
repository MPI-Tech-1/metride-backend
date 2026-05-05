import { type HttpContext } from '@adonisjs/core/http'
import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import FetchWalletTransactionsRequestValidator from '#validators/v1/driver/wallet/fetch_wallet_transactions_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchWalletTransactionsController {
  async handle({ request, auth, response }: HttpContext) {
    const {
      page = 1,
      limit = 10,
      typeOfTransaction,
      status,
    } = await request.validateUsing(FetchWalletTransactionsRequestValidator)

    try {
      const loggedInDriver = auth.use('driver').user!

      const { driverWalletTransactionPayload: transactions, paginationMeta } =
        await DriverWalletTransactionActions.listDriverWalletTransactions({
          filterRecordOptionsPayload: {
            driverId: loggedInDriver.id,
            typeOfTransaction,
            status,
          },
          paginationPayload: {
            page,
            limit,
          },
        })

      const mutatedResponsePayload = transactions.map((transaction) => ({
        identifier: transaction.identifier,
        amount: transaction.amount,
        typeOfTransaction: transaction.typeOfTransaction,
        status: transaction.status,
        remark: transaction.remark,
        systemGeneratedTransactionReference: transaction.systemGeneratedTransactionReference,
        providerTransactionReference: transaction.providerTransactionReference,
        transactionDate: transaction.updatedAt,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Wallet transactions fetched successfully.',
        results: {
          driverWalletTransactions: mutatedResponsePayload,
          paginationMeta,
        },
      })
    } catch (FetchWalletTransactionsControllerError) {
      console.log(
        'FetchWalletTransactionsControllerError -> ',
        FetchWalletTransactionsControllerError
      )
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
