import configureBookingUpdateLoggerProvider from '#infrastructure_providers/helpers/configure_booking_update_logger_provider'

export default async function logBookingUpdate(message: unknown): Promise<void> {
  const loggerProvider = configureBookingUpdateLoggerProvider()
  await loggerProvider.logPayload({
    message,
  })
}
