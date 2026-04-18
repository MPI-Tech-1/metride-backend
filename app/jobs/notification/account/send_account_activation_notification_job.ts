import {
  ACCOUNT_ACTIVATION_EMAIL_SUBJECT,
  ACCOUNT_ACTIVATION_EMAIL_TEMPLATE,
} from '#common/messages/email_types'
import MailClient from '#infrastructure_providers/internals/mail_client'
import { SEND_ACCOUNT_ACTIVATION_NOTIFICATION_JOB } from '#jobs/job_queue_names'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendAccountActivationNotificationJobPayload {
  email: string
  name: string
  otpToken: string
}

export default class SendAccountActivationNotificationJob extends Job<SendAccountActivationNotificationJobPayload> {
  static options: JobOptions = {
    queue: SEND_ACCOUNT_ACTIVATION_NOTIFICATION_JOB,
    maxRetries: 3,
  }

  async execute() {
    // Your job logic here
    console.log('Processing SendAccountActivationNotificationJob', this.payload)
    try {
      const { email, otpToken, name } = this.payload
      await MailClient.sendMail({
        recipientEmail: email,
        recipientName: name,
        emailSubject: ACCOUNT_ACTIVATION_EMAIL_SUBJECT,
        emailTemplate: ACCOUNT_ACTIVATION_EMAIL_TEMPLATE,
        emailPayload: {
          recipientFirstName: name,
          otpToken,
        },
      })
    } catch (sendAccountActivationNotificationJobError) {
      console.log(
        'sendAccountActivationNotificationJobError => ',
        sendAccountActivationNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendAccountActivationNotificationJob failed:', error.message)
  }
}
