import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import loggerConfig from '#config/application_logger_config'
import ApplicationLoggerProviderFactory from '#infrastructure_providers/factories/application_logger_provider_factory'
import type ApplicationLoggerInterface from '#infrastructure_providers/type_checkings/application_logger/application_logger_interface'

export default function configureApplicationLoggerProvider() {
  const currentProvider = loggerConfig.currentProvider

  const provider = new ApplicationLoggerProviderFactory(currentProvider).build()

  if (provider === SERVICE_PROVIDER_NOT_PROFILED) {
    throw new Error(SERVICE_PROVIDER_NOT_PROFILED)
  }

  return provider as ApplicationLoggerInterface
}
