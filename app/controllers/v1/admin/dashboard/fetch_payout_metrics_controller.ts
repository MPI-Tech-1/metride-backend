import { type HttpContext } from '@adonisjs/core/http'
import DriverWalletWithdrawalRequestActions from '#model_management/actions/driver_wallet_withdrawal_request_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchPayoutMetricsController {
  async handle({ response }: HttpContext) {
    try {
      const {
        totalPendingPayouts,
        totalApprovedPayoutsForPastMonth,
        totalRejectedPayoutsForPastMonth,
        totalApprovedPayoutAmountForPastMonth,
      } = await DriverWalletWithdrawalRequestActions.getPayoutMetrics()

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Payout metrics fetched successfully.',
        results: {
          totalPendingPayouts,
          totalApprovedPayoutsForPastMonth,
          totalRejectedPayoutsForPastMonth,
          totalApprovedPayoutAmountForPastMonth,
        },
      })
    } catch (FetchPayoutMetricsControllerError) {
      console.log('FetchPayoutMetricsControllerError -> ', FetchPayoutMetricsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
