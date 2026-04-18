import {
  RESET_PASSWORD_EMAIL_SUBJECT,
  RESET_PASSWORD_EMAIL_TEMPLATE,
} from '#common/messages/email_types'
import MailClient from '#infrastructure_providers/internals/mail_client'
import { SEND_RESET_PASSWORD_NOTIFICATION_JOB } from '#jobs/job_queue_names'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendResetPasswordNotificationJobPayload {
  email: string
  name: string
  otpToken: string
}

export default class SendResetPasswordNotificationJob extends Job<SendResetPasswordNotificationJobPayload> {
  static options: JobOptions = {
    queue: SEND_RESET_PASSWORD_NOTIFICATION_JOB,
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendResetPasswordNotificationJob', this.payload)
    const { email, otpToken, name } = this.payload
    try {
      await MailClient.sendMail({
        recipientEmail: email,
        recipientName: name,
        emailSubject: RESET_PASSWORD_EMAIL_SUBJECT,
        emailTemplate: RESET_PASSWORD_EMAIL_TEMPLATE,
        emailPayload: {
          recipientFirstName: name,
          otpToken,
        },
      })
    } catch (sendResetPasswordNotificationJobError) {
      console.log(
        'sendResetPasswordNotificationJobError => ',
        sendResetPasswordNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendResetPasswordNotificationJob failed:', error.message)
  }
}
