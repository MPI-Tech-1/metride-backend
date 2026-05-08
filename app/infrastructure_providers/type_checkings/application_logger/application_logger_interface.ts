interface ApplicationLoggerInterface {
  logError(error: Error): Promise<void>

  logPayload(message: any): Promise<void>
}

export default ApplicationLoggerInterface
