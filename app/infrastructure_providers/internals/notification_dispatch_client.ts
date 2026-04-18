import SendAccountActivationNotificationJob, {
  SendAccountActivationNotificationJobPayload,
} from '#jobs/notification/account/send_account_activation_notification_job'
import SendResetPasswordNotificationJob, {
  SendResetPasswordNotificationJobPayload,
} from '#jobs/notification/account/send_reset_password_notification_job'

export default class NotificationDispatchClient {
  public static async sendAccountActivationNotificationJob(
    sendAccountActivationNotificationJobPayload: SendAccountActivationNotificationJobPayload
  ) {
    // await SendAccountActivationNotificationJob.dispatch(
    //   sendAccountActivationNotificationJobPayload
    // ).toQueue(SEND_ACCOUNT_ACTIVATION_NOTIFICATION_JOB)
    await SendAccountActivationNotificationJob.dispatch(sendAccountActivationNotificationJobPayload)
  }
  public static async sendResetPasswordNotificationJob(
    sendResetPasswordNotificationJobPayload: SendResetPasswordNotificationJobPayload
  ) {
    // await SendResetPasswordNotificationJob.dispatch(
    //   sendResetPasswordNotificationJobPayload
    // ).toQueue(SEND_RESET_PASSWORD_NOTIFICATION_JOB)
    await SendResetPasswordNotificationJob.dispatch(sendResetPasswordNotificationJobPayload)
  }
}
