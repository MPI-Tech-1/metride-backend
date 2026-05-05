import SendAccountActivationNotificationJob, {
  type SendAccountActivationNotificationJobPayload,
} from '#jobs/notification/account/send_account_activation_notification_job'
import SendResetPasswordNotificationJob, {
  type SendResetPasswordNotificationJobPayload,
} from '#jobs/notification/account/send_reset_password_notification_job'
import SendDriverAccountRejectedNotificationJob, {
  type SendDriverAccountRejectedNotificationJobPayload,
} from '#jobs/notification/account/send_driver_account_rejected_notification_job'
import SendDriverAccountApprovedNotificationJob, {
  type SendDriverAccountApprovedNotificationJobPayload,
} from '#jobs/notification/account/send_driver_account_approved_notification_job'
import SendBookingDriverAssignmentNotificationJob, {
  type SendBookingDriverAssignmentNotificationJobPayload,
} from '#jobs/notification/booking/send_booking_driver_assignment_notification_job'
import SendBookingDriverCancellationNotificationJob, {
  type SendBookingDriverCancellationNotificationJobPayload,
} from '#jobs/notification/booking/send_booking_driver_cancellation_notification_job'
import SendBookingCompletedNotificationJob, {
  type SendBookingCompletedNotificationJobPayload,
} from '#jobs/notification/booking/send_booking_completed_notification_job'
import SendBookingTripProgressNotificationJob, {
  type SendBookingTripProgressNotificationJobPayload,
} from '#jobs/notification/booking/send_booking_trip_progress_notification_job'
import SendBookingDriverAcceptedNotificationJob, {
  type SendBookingDriverAcceptedNotificationJobPayload,
} from '#jobs/notification/booking/send_booking_driver_accepted_notification_job'
import SendBookingRejectedNotificationJob, {
  type SendBookingRejectedNotificationJobPayload,
} from '#jobs/notification/booking/send_booking_rejected_notification_job'
import SendBookingPaymentSuccessNotificationJob, {
  type SendBookingPaymentSuccessNotificationJobPayload,
} from '#jobs/notification/booking/send_booking_payment_success_notification_job'
import SendBookingPaymentFailedNotificationJob, {
  type SendBookingPaymentFailedNotificationJobPayload,
} from '#jobs/notification/booking/send_booking_payment_failed_notification_job'
import SendWalletPayoutApprovedNotificationJob, {
  type SendWalletPayoutApprovedNotificationJobPayload,
} from '#jobs/notification/wallet/send_wallet_payout_approved_notification_job'
import SendWalletPayoutRejectedNotificationJob, {
  type SendWalletPayoutRejectedNotificationJobPayload,
} from '#jobs/notification/wallet/send_wallet_payout_rejected_notification_job'

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

  public static async sendBookingDriverAssignmentNotificationJob(
    sendBookingDriverAssignmentNotificationJobPayload: SendBookingDriverAssignmentNotificationJobPayload
  ) {
    await SendBookingDriverAssignmentNotificationJob.dispatch(
      sendBookingDriverAssignmentNotificationJobPayload
    )
  }

  public static async sendBookingDriverCancellationNotificationJob(
    sendBookingDriverCancellationNotificationJobPayload: SendBookingDriverCancellationNotificationJobPayload
  ) {
    await SendBookingDriverCancellationNotificationJob.dispatch(
      sendBookingDriverCancellationNotificationJobPayload
    )
  }

  public static async sendBookingCompletedNotificationJob(
    sendBookingCompletedNotificationJobPayload: SendBookingCompletedNotificationJobPayload
  ) {
    await SendBookingCompletedNotificationJob.dispatch(sendBookingCompletedNotificationJobPayload)
  }

  public static async sendBookingTripProgressNotificationJob(
    sendBookingTripProgressNotificationJobPayload: SendBookingTripProgressNotificationJobPayload
  ) {
    await SendBookingTripProgressNotificationJob.dispatch(
      sendBookingTripProgressNotificationJobPayload
    )
  }

  public static async sendBookingDriverAcceptedNotificationJob(
    sendBookingDriverAcceptedNotificationJobPayload: SendBookingDriverAcceptedNotificationJobPayload
  ) {
    await SendBookingDriverAcceptedNotificationJob.dispatch(
      sendBookingDriverAcceptedNotificationJobPayload
    )
  }

  public static async sendBookingRejectedNotificationJob(
    sendBookingRejectedNotificationJobPayload: SendBookingRejectedNotificationJobPayload
  ) {
    await SendBookingRejectedNotificationJob.dispatch(sendBookingRejectedNotificationJobPayload)
  }

  public static async sendDriverAccountRejectedNotificationJob(
    sendDriverAccountRejectedNotificationJobPayload: SendDriverAccountRejectedNotificationJobPayload
  ) {
    await SendDriverAccountRejectedNotificationJob.dispatch(
      sendDriverAccountRejectedNotificationJobPayload
    )
  }

  public static async sendDriverAccountApprovedNotificationJob(
    sendDriverAccountApprovedNotificationJobPayload: SendDriverAccountApprovedNotificationJobPayload
  ) {
    await SendDriverAccountApprovedNotificationJob.dispatch(
      sendDriverAccountApprovedNotificationJobPayload
    )
  }

  public static async sendBookingPaymentSuccessNotificationJob(
    sendBookingPaymentSuccessNotificationJobPayload: SendBookingPaymentSuccessNotificationJobPayload
  ) {
    await SendBookingPaymentSuccessNotificationJob.dispatch(
      sendBookingPaymentSuccessNotificationJobPayload
    )
  }

  public static async sendBookingPaymentFailedNotificationJob(
    sendBookingPaymentFailedNotificationJobPayload: SendBookingPaymentFailedNotificationJobPayload
  ) {
    await SendBookingPaymentFailedNotificationJob.dispatch(
      sendBookingPaymentFailedNotificationJobPayload
    )
  }

  public static async sendWalletPayoutApprovedNotificationJob(
    sendWalletPayoutApprovedNotificationJobPayload: SendWalletPayoutApprovedNotificationJobPayload
  ) {
    await SendWalletPayoutApprovedNotificationJob.dispatch(
      sendWalletPayoutApprovedNotificationJobPayload
    )
  }

  public static async sendWalletPayoutRejectedNotificationJob(
    sendWalletPayoutRejectedNotificationJobPayload: SendWalletPayoutRejectedNotificationJobPayload
  ): Promise<void> {
    await SendWalletPayoutRejectedNotificationJob.dispatch(
      sendWalletPayoutRejectedNotificationJobPayload
    )
  }
}
