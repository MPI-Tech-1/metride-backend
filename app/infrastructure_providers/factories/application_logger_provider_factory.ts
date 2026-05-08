import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import SlackApplicationLoggerProvider from '#infrastructure_providers/externals/application_logger/slack_application_logger_provider'
import type ApplicationLoggerInterface from '#infrastructure_providers/type_checkings/application_logger/application_logger_interface'

export default class ApplicationLoggerProviderFactory {
  private currentProvider: string

  constructor(provider: string) {
    this.currentProvider = provider
  }

  public build(): ApplicationLoggerInterface | string {
    if (this.currentProvider === 'slack') {
      return new SlackApplicationLoggerProvider()
    }

    return SERVICE_PROVIDER_NOT_PROFILED
  }
}
