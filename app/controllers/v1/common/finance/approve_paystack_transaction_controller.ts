import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG } from '#common/messages/system_messages'
import BackgroundDispatchClient from '#infrastructure_providers/internals/background_dispatch_client'
import DriverWalletWithdrawalRequestActions from '#model_management/actions/driver_wallet_withdrawal_request_actions'
import TransferApprovalLogActions from '#model_management/actions/transfer_approval_log_actions'
import { type HttpContext } from '@adonisjs/core/http'

export default class ProcessApprovePaystackTransactionController {
  public async handle({ request, response }: HttpContext) {
    try {
      const payload = request.all()

      await TransferApprovalLogActions.createTransferApprovalLogRecord({
        createPayload: {
          provider: 'paystack',
          logs: JSON.stringify(payload),
        },
        dbTransactionOptions: {
          useTransaction: false,
        },
      })

      const transferData = payload.data.details.body

      if (!transferData) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({})
      }

      const pendingTransferTransaction =
        await DriverWalletWithdrawalRequestActions.getDriverWalletWithdrawalRequest({
          identifierType: 'identifier',
          identifier: transferData.reference,
        })

      console.log('pendingTransferTransaction -> ', pendingTransferTransaction?.identifier)
      if (
        pendingTransferTransaction === null ||
        pendingTransferTransaction.amount !== transferData.amount ||
        pendingTransferTransaction.status !== 'processing'
      ) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({})
      }

      await BackgroundDispatchClient.processApprovePaystackTransactionBackgroundProcessingJob({
        transactionReference: transferData.reference,
      })

      return response.status(HttpStatusCodesEnum.OK).send({})
    } catch (ProcessApprovePaystackTransactionControllerError) {
      console.log(
        '🚀 ~ ProcessApprovePaystackTransactionControllerError.handle ProcessApprovePaystackTransactionControllerError ->',
        ProcessApprovePaystackTransactionControllerError
      )
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
