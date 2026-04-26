import CreateBookingPaymentRecordOptions from '#model_management/type_checking/booking_payment/create_booking_payment_record_options'
import ListBookingPaymentRecordsOptions from '#model_management/type_checking/booking_payment/list_booking_payment_records_options'
import UpdateBookingPaymentRecordOptions from '#model_management/type_checking/booking_payment/update_booking_payment_record_options'
import BookingPaymentIdentifierOptions from '#model_management/type_checking/booking_payment/booking_payment_identifier_options'
import BookingPayment from '#models/booking_payment'

export default class BookingPaymentActions {
  public static async createBookingPaymentRecord(
    createBookingPaymentRecordOptions: CreateBookingPaymentRecordOptions
  ): Promise<BookingPayment> {
    const { createPayload, dbTransactionOptions } = createBookingPaymentRecordOptions

    const bookingPayment = new BookingPayment()
    Object.assign(bookingPayment, createPayload)

    if (dbTransactionOptions.useTransaction) {
      bookingPayment.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await bookingPayment.save()

    return bookingPayment
  }

  public static async getBookingPaymentById(bookingPaymentId: number): Promise<BookingPayment | null> {
    return await BookingPayment.query().preload('booking').where('id', bookingPaymentId).first()
  }

  public static async getBookingPaymentByIdentifier(
    bookingPaymentIdentifier: string
  ): Promise<BookingPayment | null> {
    return await BookingPayment.query()
      .preload('booking')
      .where('identifier', bookingPaymentIdentifier)
      .first()
  }

  public static async getBookingPayment(
    getBookingPaymentOptions: BookingPaymentIdentifierOptions
  ): Promise<BookingPayment | null> {
    const { identifier, identifierType } = getBookingPaymentOptions

    const GetBookingPaymentIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getBookingPaymentById(Number(identifier)),

      identifier: async () => await this.getBookingPaymentByIdentifier(String(identifier)),
    }

    return await GetBookingPaymentIdentifierOptions[identifierType]()
  }

  public static async updateBookingPaymentRecord(
    updateBookingPaymentRecordOptions: UpdateBookingPaymentRecordOptions
  ): Promise<BookingPayment | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateBookingPaymentRecordOptions

    const bookingPayment = await this.getBookingPayment(identifierOptions)

    if (bookingPayment === null) return null

    Object.assign(bookingPayment, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      bookingPayment.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await bookingPayment.save()

    return bookingPayment
  }

  public static async listBookingPayments(
    getBookingPaymentRecordOptions: ListBookingPaymentRecordsOptions
  ): Promise<{ bookingPaymentPayload: BookingPayment[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getBookingPaymentRecordOptions

    const bookingPaymentQuery = BookingPayment.query().preload('booking')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      bookingPaymentQuery.whereILike('identifier', searchValue)
    }

    if (filterRecordOptionsPayload?.bookingId) {
      bookingPaymentQuery.where('booking_id', filterRecordOptionsPayload.bookingId)
    }

    if (paginationPayload) {
      const bookingPayments = await bookingPaymentQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        bookingPaymentPayload: bookingPayments.all(),
        paginationMeta: bookingPayments.getMeta(),
      }
    }

    const bookingPayments = await bookingPaymentQuery.orderBy('created_at', 'desc')
    return {
      bookingPaymentPayload: bookingPayments,
    }
  }
}
