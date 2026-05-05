import {
  WALLET_PAYOUT_APPROVED_EMAIL_SUBJECT,
  WALLET_PAYOUT_APPROVED_EMAIL_TEMPLATE,
} from '#common/messages/email_types'
import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import MailClient from '#infrastructure_providers/internals/mail_client'
import DriverNotificationActions from '#model_management/actions/driver_notification_actions'
import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendWalletPayoutApprovedNotificationJobPayload {
  walletTransactionId: number
}

export default class SendWalletPayoutApprovedNotificationJob extends Job<SendWalletPayoutApprovedNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendWalletPayoutApprovedNotificationJob', this.payload)
    const { walletTransactionId } = this.payload

    const walletTransaction = await DriverWalletTransactionActions.getDriverWalletTransaction({
      identifierType: 'id',
      identifier: walletTransactionId,
    })

    if (!walletTransaction) {
      throw new Error('SendWalletPayoutApprovedNotificationJob: wallet transaction not found')
    }

    if (walletTransaction.status !== 'completed') {
      throw new Error(
        'SendWalletPayoutApprovedNotificationJob: wallet transaction has not been completed'
      )
    }

    const dbTransaction = await db.transaction()

    try {
      const driverNotification = await DriverNotificationActions.createDriverNotificationRecord({
        createPayload: {
          driverId: walletTransaction.driverId,
          content: `Your payout of ${walletTransaction.amount} has been approved and is being processed.`,
          isNotificationRead: false,
          payload: {
            identifier: walletTransaction.identifier,
          },
          notificationType: 'wallet:payout_approved',
        },
        dbTransactionOptions: { dbTransaction, useTransaction: true },
      })

      await dbTransaction.commit()

      const driver = walletTransaction.driver

      if (driver.fcmToken) {
        const pushNotificationProvider = configurePushNotificationProvider()

        await pushNotificationProvider.send({
          token: driver.fcmToken,
          notification: {
            title: 'Payout Approved',
            body: driverNotification.content,
          },
          data: {
            identifier: driverNotification.identifier,
            content: driverNotification.content,
          },
        })
      }

      await MailClient.sendMail({
        recipientEmail: driver.email,
        recipientName: `${driver.firstName} ${driver.lastName}`,
        emailSubject: WALLET_PAYOUT_APPROVED_EMAIL_SUBJECT,
        emailTemplate: WALLET_PAYOUT_APPROVED_EMAIL_TEMPLATE,
        emailPayload: {
          recipientFirstName: driver.firstName,
          amount: walletTransaction.amount,
          transactionReference: walletTransaction.systemGeneratedTransactionReference,
        },
      })
    } catch (sendWalletPayoutApprovedNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendWalletPayoutApprovedNotificationJobError => ',
        sendWalletPayoutApprovedNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendWalletPayoutApprovedNotificationJob failed:', error.message)
  }
}
