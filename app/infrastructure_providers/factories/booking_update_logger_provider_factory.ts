import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import SlackBookingUpdateLoggerProvider from '#infrastructure_providers/externals/booking_update_logger/slack_booking_update_logger_provider'
import type BookingUpdateLoggerInterface from '#infrastructure_providers/type_checkings/booking_update_logger/booking_update_logger_interface'

export default class BookingUpdateLoggerProviderFactory {
  private currentProvider: string

  constructor(provider: string) {
    this.currentProvider = provider
  }

  public build(): BookingUpdateLoggerInterface | string {
    if (this.currentProvider === 'slack') {
      return new SlackBookingUpdateLoggerProvider()
    }

    return SERVICE_PROVIDER_NOT_PROFILED
  }
}
