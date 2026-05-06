import type CreateBookingGpsLogRecordOptions from '#model_management/type_checking/booking_gps_log/create_booking_gps_log_record_options'
import type ListBookingGpsLogRecordsOptions from '#model_management/type_checking/booking_gps_log/list_booking_gps_log_records_options'
import type UpdateBookingGpsLogRecordOptions from '#model_management/type_checking/booking_gps_log/update_booking_gps_log_record_options'
import type BookingGpsLogIdentifierOptions from '#model_management/type_checking/booking_gps_log/booking_gps_log_identifier_options'
import BookingGpsLog from '#models/booking_gps_log'

export default class BookingGpsLogActions {
  public static async createBookingGpsLogRecord(
    createBookingGpsLogRecordOptions: CreateBookingGpsLogRecordOptions
  ): Promise<BookingGpsLog> {
    const { createPayload, dbTransactionOptions } = createBookingGpsLogRecordOptions

    const bookingGpsLog = new BookingGpsLog()
    Object.assign(bookingGpsLog, createPayload)

    if (dbTransactionOptions.useTransaction) {
      bookingGpsLog.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await bookingGpsLog.save()

    return bookingGpsLog
  }

  private static async getBookingGpsLogById(
    bookingGpsLogId: number
  ): Promise<BookingGpsLog | null> {
    return await BookingGpsLog.query().where('id', bookingGpsLogId).first()
  }

  private static async getBookingGpsLogByIdentifier(
    bookingGpsLogIdentifier: string
  ): Promise<BookingGpsLog | null> {
    return await BookingGpsLog.query().where('identifier', bookingGpsLogIdentifier).first()
  }

  public static async getBookingGpsLog(
    getBookingGpsLogOptions: BookingGpsLogIdentifierOptions
  ): Promise<BookingGpsLog | null> {
    const { identifier, identifierType } = getBookingGpsLogOptions

    const GetBookingGpsLogIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getBookingGpsLogById(Number(identifier)),

      identifier: async () => await this.getBookingGpsLogByIdentifier(String(identifier)),
    }

    return await GetBookingGpsLogIdentifierOptions[identifierType]()
  }

  public static async updateBookingGpsLogRecord(
    updateBookingGpsLogRecordOptions: UpdateBookingGpsLogRecordOptions
  ): Promise<BookingGpsLog | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateBookingGpsLogRecordOptions

    const bookingGpsLog = await this.getBookingGpsLog(identifierOptions)

    if (bookingGpsLog === null) return null

    Object.assign(bookingGpsLog, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      bookingGpsLog.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await bookingGpsLog.save()

    return bookingGpsLog
  }

  public static async listBookingGpsLogs(
    getBookingGpsLogRecordOptions: ListBookingGpsLogRecordsOptions
  ): Promise<{ bookingGpsLogPayload: BookingGpsLog[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getBookingGpsLogRecordOptions

    const bookingGpsLogQuery = BookingGpsLog.query()

    if (filterRecordOptionsPayload?.bookingId) {
      bookingGpsLogQuery.where('booking_id', filterRecordOptionsPayload.bookingId)
    }

    if (filterRecordOptionsPayload?.customerId) {
      bookingGpsLogQuery.where('customer_id', filterRecordOptionsPayload.customerId)
    }

    if (filterRecordOptionsPayload?.driverId) {
      bookingGpsLogQuery.where('driver_id', filterRecordOptionsPayload.driverId)
    }

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`
      bookingGpsLogQuery.whereILike('gps_coordinates', searchValue)
    }

    if (paginationPayload) {
      const bookingGpsLogs = await bookingGpsLogQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        bookingGpsLogPayload: bookingGpsLogs.all(),
        paginationMeta: bookingGpsLogs.getMeta(),
      }
    }

    const bookingGpsLogs = await bookingGpsLogQuery.orderBy('created_at', 'desc')
    return {
      bookingGpsLogPayload: bookingGpsLogs,
    }
  }
}
