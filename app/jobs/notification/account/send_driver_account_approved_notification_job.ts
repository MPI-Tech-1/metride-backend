import {
  DRIVER_ACCOUNT_APPROVED_EMAIL_SUBJECT,
  DRIVER_ACCOUNT_APPROVED_EMAIL_TEMPLATE,
} from '#common/messages/email_types'
import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import MailClient from '#infrastructure_providers/internals/mail_client'
import DriverActions from '#model_management/actions/driver_actions'
import DriverNotificationActions from '#model_management/actions/driver_notification_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendDriverAccountApprovedNotificationJobPayload {
  driverId: number
}

export default class SendDriverAccountApprovedNotificationJob extends Job<SendDriverAccountApprovedNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendDriverAccountApprovedNotificationJob', this.payload)
    const { driverId } = this.payload

    const driver = await DriverActions.getDriver({
      identifierType: 'id',
      identifier: driverId,
    })

    if (!driver) {
      throw new Error('SendDriverAccountApprovedNotificationJob: driver not found')
    }

    if (driver.status !== 'approved') {
      throw new Error(
        'SendDriverAccountApprovedNotificationJob: driver account has not been approved'
      )
    }

    const dbTransaction = await db.transaction()

    try {
      const driverNotification = await DriverNotificationActions.createDriverNotificationRecord({
        createPayload: {
          driverId: driver.id,
          content:
            'Congratulations! Your driver account has been approved. You can now start accepting rides.',
          isNotificationRead: false,
          payload: {
            identifier: driver.identifier,
          },
          notificationType: 'account:approved',
        },
        dbTransactionOptions: { dbTransaction, useTransaction: true },
      })

      await dbTransaction.commit()

      if (driver.fcmToken) {
        const pushNotificationProvider = configurePushNotificationProvider()

        await pushNotificationProvider.send({
          token: driver.fcmToken,
          notification: {
            title: 'Account Approved',
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
        emailSubject: DRIVER_ACCOUNT_APPROVED_EMAIL_SUBJECT,
        emailTemplate: DRIVER_ACCOUNT_APPROVED_EMAIL_TEMPLATE,
        emailPayload: {
          recipientFirstName: driver.firstName,
        },
      })
    } catch (sendDriverAccountApprovedNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendDriverAccountApprovedNotificationJobError => ',
        sendDriverAccountApprovedNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendDriverAccountApprovedNotificationJob failed:', error.message)
  }
}
