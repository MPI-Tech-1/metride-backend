import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import bookingUpdateLoggerConfig from '#config/booking_update_logger'
import BookingUpdateLoggerProviderFactory from '#infrastructure_providers/factories/booking_update_logger_provider_factory'
import type BookingUpdateLoggerInterface from '#infrastructure_providers/type_checkings/booking_update_logger/booking_update_logger_interface'

export default function configureBookingUpdateLoggerProvider() {
  const currentProvider = bookingUpdateLoggerConfig.currentProvider

  const provider = new BookingUpdateLoggerProviderFactory(currentProvider).build()

  if (provider === SERVICE_PROVIDER_NOT_PROFILED) {
    throw new Error(SERVICE_PROVIDER_NOT_PROFILED)
  }

  return provider as BookingUpdateLoggerInterface
}
