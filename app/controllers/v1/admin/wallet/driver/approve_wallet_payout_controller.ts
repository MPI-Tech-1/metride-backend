import { type HttpContext } from '@adonisjs/core/http'
import DriverWalletActions from '#model_management/actions/driver_wallet_actions'
import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'

export default class ApproveWalletPayoutController {
  async handle({ params, response }: HttpContext) {
    const { walletTransactionIdentifier } = params

    const dbTransaction = await db.transaction()

    try {
      const walletTransaction = await DriverWalletTransactionActions.getDriverWalletTransaction({
        identifierType: 'identifier',
        identifier: walletTransactionIdentifier,
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      if (!walletTransaction) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Wallet transaction not found.',
        })
      }

      if (walletTransaction.status !== 'pending') {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Only pending transactions can be approved.',
        })
      }

      const wallet = await DriverWalletActions.getDriverWallet({
        identifierType: 'id',
        identifier: walletTransaction.driverWalletId,
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

      if (wallet.balance < walletTransaction.amount) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Insufficient wallet balance to process this payout.',
        })
      }

      await DriverWalletActions.updateDriverWalletRecord({
        identifierOptions: { identifierType: 'id', identifier: wallet.id },
        updatePayload: {
          balance: wallet.balance - walletTransaction.amount,
          totalOutflowFunds: wallet.totalOutflowFunds + walletTransaction.amount,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverWalletTransactionActions.updateDriverWalletTransactionRecord({
        identifierOptions: { identifierType: 'id', identifier: walletTransaction.id },
        updatePayload: { status: 'completed' },
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
          identifier: walletTransaction.identifier,
          amount: walletTransaction.amount,
          status: 'completed',
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
