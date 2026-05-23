import {
  ADMIN_ACCOUNT_CREATED_EMAIL_SUBJECT,
  ADMIN_ACCOUNT_CREATED_EMAIL_TEMPLATE,
} from '#common/messages/email_types'
import MailClient from '#infrastructure_providers/internals/mail_client'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import logApplicationError from '#common/helper_functions/log_application_error'

export interface SendAdminAccountCreatedNotificationJobPayload {
  email: string
  name: string
  tempPassword: string
  role: string
}

export default class SendAdminAccountCreatedNotificationJob extends Job<SendAdminAccountCreatedNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendAdminAccountCreatedNotificationJob', this.payload)
    try {
      const { email, name, tempPassword, role } = this.payload
      await MailClient.sendMail({
        recipientEmail: email,
        recipientName: name,
        emailSubject: ADMIN_ACCOUNT_CREATED_EMAIL_SUBJECT,
        emailTemplate: ADMIN_ACCOUNT_CREATED_EMAIL_TEMPLATE,
        emailPayload: {
          recipientFirstName: name,
          recipientEmail: email,
          tempPassword,
          role,
        },
      })
    } catch (sendAdminAccountCreatedNotificationJobError) {
      console.log(
        'sendAdminAccountCreatedNotificationJobError => ',
        sendAdminAccountCreatedNotificationJobError
      )
      await logApplicationError(sendAdminAccountCreatedNotificationJobError)
    }
  }

  async failed(error: Error) {
    console.error('SendAdminAccountCreatedNotificationJob failed:', error.message)
    await logApplicationError(error)
  }
}
