import env from '#start/env'
import mail from '@adonisjs/mail/services/main'

interface EmailOptionsInterface {
  senderEmail?: string

  senderName?: string

  recipientEmail: string

  recipientName: string

  emailSubject: string

  emailTemplate: string

  sendLater?: boolean

  emailPayload?: object
}

/*
|--------------------------------------------------------------------------
| An internal abstraction on the AdonisJS Mailer Class and functions.
| This provides a reusable Mail Client Interface which can be
| easily ported if system is decomposed
|--------------------------------------------------------------------------
|
*/
class MailClient {
  private static emailSenderName = env.get('MAIL_FROM_NAME')
  private static emailSenderAddress = env.get('MAIL_FROM_ADDRESS')

  /**
   * @description Simple Email Sending with an in-memory queue
   * @static
   * @param {EmailOptionsInterface} emailOptions The email options and customizable data
   * @returns {*}  {Promise<void>}
   * @memberof MailClient
   */
  public static async sendMail(emailOptions: EmailOptionsInterface): Promise<void> {
    const {
      senderName = this.emailSenderName,
      senderEmail = this.emailSenderAddress,
      recipientName,
      recipientEmail,
      emailSubject,
      emailTemplate,
      sendLater = false,
      emailPayload,
    } = emailOptions

    if (sendLater === false) {
      await mail.use('smtp').send((message) => {
        message.from(senderEmail, senderName)
        message.to(recipientEmail, recipientName)
        message.subject(emailSubject)
        message.htmlView(emailTemplate, emailPayload)
      })
    } else {
      await mail.use('smtp').sendLater((delayedMessage) => {
        delayedMessage.from(senderEmail, senderName)
        delayedMessage.to(recipientEmail, recipientName)
        delayedMessage.subject(emailSubject)
        delayedMessage.htmlView(emailTemplate, emailPayload)
      })
    }
  }
}

export default MailClient
