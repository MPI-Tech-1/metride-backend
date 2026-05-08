import configureApplicationLoggerProvider from '#infrastructure_providers/helpers/configure_application_logger_provider'

export default async function logApplicationError(error: Error | unknown): Promise<void> {
  const loggerProvider = configureApplicationLoggerProvider()
  await loggerProvider.logError(error)
}
