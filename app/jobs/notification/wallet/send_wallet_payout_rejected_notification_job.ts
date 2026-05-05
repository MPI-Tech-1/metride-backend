import {
  WALLET_PAYOUT_REJECTED_EMAIL_SUBJECT,
  WALLET_PAYOUT_REJECTED_EMAIL_TEMPLATE,
} from '#common/messages/email_types'
import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import MailClient from '#infrastructure_providers/internals/mail_client'
import DriverActions from '#model_management/actions/driver_actions'
import DriverNotificationActions from '#model_management/actions/driver_notification_actions'
import DriverWalletWithdrawalRequestActions from '#model_management/actions/driver_wallet_withdrawal_request_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendWalletPayoutRejectedNotificationJobPayload {
  withdrawalRequestId: number
}

export default class SendWalletPayoutRejectedNotificationJob extends Job<SendWalletPayoutRejectedNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendWalletPayoutRejectedNotificationJob', this.payload)
    const { withdrawalRequestId } = this.payload

    const withdrawalRequest =
      await DriverWalletWithdrawalRequestActions.getDriverWalletWithdrawalRequest({
        identifierType: 'id',
        identifier: withdrawalRequestId,
      })

    if (!withdrawalRequest) {
      throw new Error('SendWalletPayoutRejectedNotificationJob: withdrawal request not found')
    }

    if (withdrawalRequest.status !== 'rejected') {
      throw new Error(
        'SendWalletPayoutRejectedNotificationJob: withdrawal request has not been rejected'
      )
    }

    const driver = await DriverActions.getDriver({
      identifier: withdrawalRequest.driverId,
      identifierType: 'id',
    })

    if (!driver) {
      throw new Error('SendWalletPayoutRejectedNotificationJob: driver not found')
    }

    const dbTransaction = await db.transaction()

    try {
      const driverNotification = await DriverNotificationActions.createDriverNotificationRecord({
        createPayload: {
          driverId: withdrawalRequest.driverId,
          content: `Your payout request of ${withdrawalRequest.amount} could not be processed.`,
          isNotificationRead: false,
          payload: {
            identifier: withdrawalRequest.identifier,
          },
          notificationType: 'wallet:payout_rejected',
        },
        dbTransactionOptions: { dbTransaction, useTransaction: true },
      })

      await dbTransaction.commit()

      if (driver.fcmToken) {
        const pushNotificationProvider = configurePushNotificationProvider()

        await pushNotificationProvider.send({
          token: driver.fcmToken,
          notification: {
            title: 'Payout Not Processed',
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
        emailSubject: WALLET_PAYOUT_REJECTED_EMAIL_SUBJECT,
        emailTemplate: WALLET_PAYOUT_REJECTED_EMAIL_TEMPLATE,
        emailPayload: {
          recipientFirstName: driver.firstName,
          amount: withdrawalRequest.amount,
          transactionReference: withdrawalRequest.identifier,
        },
      })
    } catch (sendWalletPayoutRejectedNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendWalletPayoutRejectedNotificationJobError => ',
        sendWalletPayoutRejectedNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendWalletPayoutRejectedNotificationJob failed:', error.message)
  }
}
