import { type HttpContext } from '@adonisjs/core/http'
import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchWalletTransactionMetricsController {
  async handle({ response }: HttpContext) {
    try {
      const {
        totalCreditTransactionsForPastMonth,
        totalDebitTransactionsForPastMonth,
        totalCreditAmountForPastMonth,
        totalDebitAmountForPastMonth,
      } = await DriverWalletTransactionActions.getWalletTransactionMetrics()

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Wallet transaction metrics fetched successfully.',
        results: {
          totalCreditTransactionsForPastMonth,
          totalDebitTransactionsForPastMonth,
          totalCreditAmountForPastMonth,
          totalDebitAmountForPastMonth,
        },
      })
    } catch (FetchWalletTransactionMetricsControllerError) {
      console.log(
        'FetchWalletTransactionMetricsControllerError -> ',
        FetchWalletTransactionMetricsControllerError
      )
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
