import ProcessBookingPaymentJob, {
  type ProcessBookingPaymentJobPayload,
} from '#jobs/background_processing/booking/process_booking_payment_job'
import ProcessDriverWalletEarningJob, {
  type ProcessDriverWalletEarningJobPayload,
} from '#jobs/background_processing/booking/process_driver_wallet_earning_job'

export default class BackgroundDispatchClient {
  public static async processBookingPaymentJob(
    processBookingPaymentJobPayload: ProcessBookingPaymentJobPayload
  ) {
    await ProcessBookingPaymentJob.dispatch(processBookingPaymentJobPayload)
  }

  public static async processDriverWalletEarningJob(
    processDriverWalletEarningJobPayload: ProcessDriverWalletEarningJobPayload
  ) {
    await ProcessDriverWalletEarningJob.dispatch(processDriverWalletEarningJobPayload)
  }
}
