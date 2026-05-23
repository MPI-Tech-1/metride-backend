import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { randomUUID } from 'node:crypto'
import logApplicationError from '#common/helper_functions/log_application_error'
import DriverWalletWithdrawalRequestActions from '#model_management/actions/driver_wallet_withdrawal_request_actions'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import DriverWalletActions from '#model_management/actions/driver_wallet_actions'

export interface ProcessApprovePaystackTransactionBackgroundProcessingJobPayload {
  transactionReference: string
}

export default class ProcessApprovePaystackTransactionBackgroundProcessingJob extends Job<ProcessApprovePaystackTransactionBackgroundProcessingJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing ProcessApprovePaystackTransactionBackgroundProcessingJob', this.payload)
    const { transactionReference } = this.payload

    const withdrawalRequest =
      await DriverWalletWithdrawalRequestActions.getDriverWalletWithdrawalRequest({
        identifierType: 'identifier',
        identifier: transactionReference,
      })

    if (withdrawalRequest === null || withdrawalRequest.status !== 'processing') {
      throw new Error('Pending transfer transaction not found or not processing')
    }

    const wallet = await DriverWalletActions.getDriverWallet({
      identifierType: 'id',
      identifier: withdrawalRequest.driverWalletId,
    })

    if (wallet === null) {
      throw new Error('Driver wallet not found')
    }

    const dbTransaction = await db.transaction()

    try {
      const walletTransaction =
        await DriverWalletTransactionActions.createDriverWalletTransactionRecord({
          createPayload: {
            driverId: withdrawalRequest.driverId,
            driverWalletId: withdrawalRequest.driverWalletId,
            amount: withdrawalRequest.amount,
            systemGeneratedTransactionReference: randomUUID(),
            providerTransactionReference: withdrawalRequest.identifier,
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
    } catch (ProcessApprovePaystackTransactionBackgroundProcessingJobError) {
      await dbTransaction.rollback()
      console.log(
        'ProcessApprovePaystackTransactionBackgroundProcessingJobError => ',
        ProcessApprovePaystackTransactionBackgroundProcessingJobError
      )
      await logApplicationError(ProcessApprovePaystackTransactionBackgroundProcessingJobError)
    }
  }

  async failed(error: Error) {
    console.error('ProcessApprovePaystackTransactionBackgroundProcessingJob failed:', error.message)
    await logApplicationError(error)
  }
}
