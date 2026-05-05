import { type HttpContext } from '@adonisjs/core/http'
import DriverActions from '#model_management/actions/driver_actions'
import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import FetchDriverWalletTransactionsRequestValidator from '#validators/v1/admin/wallet/driver/fetch_driver_wallet_transactions_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchWalletTransactionsController {
  async handle({ request, response }: HttpContext) {
    const {
      driverIdentifier,
      page = 1,
      limit = 10,
      typeOfTransaction,
      status,
    } = await request.validateUsing(FetchDriverWalletTransactionsRequestValidator)

    try {
      const driver = await DriverActions.getDriver({
        identifierType: 'identifier',
        identifier: driverIdentifier ?? '',
      })

      const { driverWalletTransactionPayload: transactions, paginationMeta } =
        await DriverWalletTransactionActions.listDriverWalletTransactions({
          filterRecordOptionsPayload: {
            driverId: driver?.id,
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
        driver: {
          identifier: transaction.driver.identifier,
          fullName: transaction.driver.fullName,
        },
        remark: transaction.remark,
        systemGeneratedTransactionReference: transaction.systemGeneratedTransactionReference,
        providerTransactionReference: transaction.providerTransactionReference,
        createdAt: transaction.createdAt,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver wallet transactions fetched successfully.',
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
