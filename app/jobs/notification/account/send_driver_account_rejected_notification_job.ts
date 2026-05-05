import {
  DRIVER_ACCOUNT_REJECTED_EMAIL_SUBJECT,
  DRIVER_ACCOUNT_REJECTED_EMAIL_TEMPLATE,
} from '#common/messages/email_types'
import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import MailClient from '#infrastructure_providers/internals/mail_client'
import DriverActions from '#model_management/actions/driver_actions'
import DriverNotificationActions from '#model_management/actions/driver_notification_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendDriverAccountRejectedNotificationJobPayload {
  driverId: number
  rejectionReason: string
}

export default class SendDriverAccountRejectedNotificationJob extends Job<SendDriverAccountRejectedNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendDriverAccountRejectedNotificationJob', this.payload)
    const { driverId, rejectionReason } = this.payload

    const driver = await DriverActions.getDriver({
      identifierType: 'id',
      identifier: driverId,
    })

    if (!driver) {
      throw new Error('SendDriverAccountRejectedNotificationJob: driver not found')
    }

    if (driver.status !== 'rejected') {
      throw new Error(
        'SendDriverAccountRejectedNotificationJob: driver account has not been rejected'
      )
    }

    const dbTransaction = await db.transaction()

    try {
      const driverNotification = await DriverNotificationActions.createDriverNotificationRecord({
        createPayload: {
          driverId: driver.id,
          content:
            'Your driver account application has been reviewed and unfortunately was not approved at this time.',
          isNotificationRead: false,
          payload: {
            identifier: driver.identifier,
          },
          notificationType: 'account:rejected',
        },
        dbTransactionOptions: { dbTransaction, useTransaction: true },
      })

      await dbTransaction.commit()

      if (driver.fcmToken) {
        const pushNotificationProvider = configurePushNotificationProvider()

        await pushNotificationProvider.send({
          token: driver.fcmToken,
          notification: {
            title: 'Account Application Update',
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
        emailSubject: DRIVER_ACCOUNT_REJECTED_EMAIL_SUBJECT,
        emailTemplate: DRIVER_ACCOUNT_REJECTED_EMAIL_TEMPLATE,
        emailPayload: {
          recipientFirstName: driver.firstName,
          rejectionReason,
        },
      })
    } catch (sendDriverAccountRejectedNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendDriverAccountRejectedNotificationJobError => ',
        sendDriverAccountRejectedNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendDriverAccountRejectedNotificationJob failed:', error.message)
  }
}
