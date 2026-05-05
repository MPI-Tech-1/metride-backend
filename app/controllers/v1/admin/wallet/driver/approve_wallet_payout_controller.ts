import { type HttpContext } from '@adonisjs/core/http'
import DriverWalletActions from '#model_management/actions/driver_wallet_actions'
import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import DriverWalletWithdrawalRequestActions from '#model_management/actions/driver_wallet_withdrawal_request_actions'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'

export default class ApproveWalletPayoutController {
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
          message: 'Only pending withdrawal requests can be approved.',
        })
      }

      const wallet = await DriverWalletActions.getDriverWallet({
        identifierType: 'id',
        identifier: withdrawalRequest.driverWalletId,
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      if (!wallet) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Driver wallet not found.',
        })
      }

      if (wallet.balance < withdrawalRequest.amount) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Insufficient wallet balance to process this payout.',
        })
      }

      const walletTransaction =
        await DriverWalletTransactionActions.createDriverWalletTransactionRecord({
          createPayload: {
            driverId: withdrawalRequest.driverId,
            driverWalletId: withdrawalRequest.driverWalletId,
            amount: withdrawalRequest.amount,
            systemGeneratedTransactionReference: randomUUID(),
            providerTransactionReference: null,
            remark: 'Wallet withdrawal payout',
            typeOfTransaction: 'debit',
            status: 'completed',
          },
          dbTransactionOptions: { useTransaction: true, dbTransaction },
        })

      await DriverWalletActions.updateDriverWalletRecord({
        identifierOptions: { identifierType: 'id', identifier: wallet.id },
        updatePayload: {
          balance: wallet.balance - withdrawalRequest.amount,
          totalOutflowFunds: wallet.totalOutflowFunds + withdrawalRequest.amount,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverWalletWithdrawalRequestActions.updateDriverWalletWithdrawalRequestRecord({
        identifierOptions: { identifierType: 'id', identifier: withdrawalRequest.id },
        updatePayload: { status: 'approved' },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await dbTransaction.commit()

      await NotificationDispatchClient.sendWalletPayoutApprovedNotificationJob({
        walletTransactionId: walletTransaction.id,
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Wallet payout approved successfully.',
        results: {
          identifier: withdrawalRequest.identifier,
          amount: withdrawalRequest.amount,
          status: 'approved',
        },
      })
    } catch (ApproveWalletPayoutControllerError) {
      await dbTransaction.rollback()
      console.log('ApproveWalletPayoutControllerError -> ', ApproveWalletPayoutControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
