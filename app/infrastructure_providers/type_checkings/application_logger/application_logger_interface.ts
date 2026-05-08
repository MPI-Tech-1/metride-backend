interface ApplicationLoggerInterface {
  logError(error: Error | unknown): Promise<void>

  logPayload(message: any): Promise<void>
}

export default ApplicationLoggerInterface
