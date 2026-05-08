interface BookingUpdateLoggerInterface {
  logError(error: Error): Promise<void>

  logPayload(message: any): Promise<void>
}

export default BookingUpdateLoggerInterface
