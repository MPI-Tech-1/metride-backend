import { type HttpContext } from '@adonisjs/core/http'
import DriverWalletWithdrawalRequestActions from '#model_management/actions/driver_wallet_withdrawal_request_actions'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'

export default class RejectWalletPayoutController {
  async handle({ params, response }: HttpContext) {
    const { withdrawalRequestIdentifier } = params

    const dbTransaction = await db.transaction()

    try {
      const withdrawalRequest =
        await DriverWalletWithdrawalRequestActions.getDriverWalletWithdrawalRequest({
          identifierType: 'identifier',
          identifier: withdrawalRequestIdentifier,
          dbTransactionOptions: { useTransaction: true, dbTransaction },
        })

      if (!withdrawalRequest) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Withdrawal request not found.',
        })
      }

      if (withdrawalRequest.status !== 'pending') {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Only pending withdrawal requests can be rejected.',
        })
      }

      await DriverWalletWithdrawalRequestActions.updateDriverWalletWithdrawalRequestRecord({
        identifierOptions: { identifierType: 'id', identifier: withdrawalRequest.id },
        updatePayload: { status: 'rejected' },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await dbTransaction.commit()

      await NotificationDispatchClient.sendWalletPayoutRejectedNotificationJob({
        withdrawalRequestId: withdrawalRequest.id,
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Wallet payout rejected successfully.',
        results: {
          identifier: withdrawalRequest.identifier,
          amount: withdrawalRequest.amount,
          status: 'rejected',
        },
      })
    } catch (RejectWalletPayoutControllerError) {
      await dbTransaction.rollback()
      console.log('RejectWalletPayoutControllerError -> ', RejectWalletPayoutControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
