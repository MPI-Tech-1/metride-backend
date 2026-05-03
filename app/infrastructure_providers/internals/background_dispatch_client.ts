import ProcessBookingPaymentJob, {
  type ProcessBookingPaymentJobPayload,
} from '#jobs/background_processing/booking/process_booking_payment_job'

export default class BackgroundDispatchClient {
  public static async processBookingPaymentJob(
    processBookingPaymentJobPayload: ProcessBookingPaymentJobPayload
  ) {
    await ProcessBookingPaymentJob.dispatch(processBookingPaymentJobPayload)
  }
}
