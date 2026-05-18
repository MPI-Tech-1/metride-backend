import type CreateBookingReviewRecordOptions from '#model_management/type_checking/booking_review/create_booking_review_record_options'
import type ListBookingReviewRecordsOptions from '#model_management/type_checking/booking_review/list_booking_review_records_options'
import type UpdateBookingReviewRecordOptions from '#model_management/type_checking/booking_review/update_booking_review_record_options'
import type BookingReviewIdentifierOptions from '#model_management/type_checking/booking_review/booking_review_identifier_options'
import BookingReview from '#models/booking_review'

export default class BookingReviewActions {
  public static async createBookingReviewRecord(
    createBookingReviewRecordOptions: CreateBookingReviewRecordOptions
  ): Promise<BookingReview> {
    const { createPayload, dbTransactionOptions } = createBookingReviewRecordOptions

    const bookingReview = new BookingReview()
    Object.assign(bookingReview, createPayload)

    if (dbTransactionOptions.useTransaction) {
      bookingReview.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await bookingReview.save()

    return bookingReview
  }

  private static async getBookingReviewById(
    bookingReviewId: number
  ): Promise<BookingReview | null> {
    return await BookingReview.query().where('id', bookingReviewId).first()
  }

  private static async getBookingReviewByIdentifier(
    bookingReviewIdentifier: string
  ): Promise<BookingReview | null> {
    return await BookingReview.query().where('identifier', bookingReviewIdentifier).first()
  }

  public static async getBookingReview(
    getBookingReviewOptions: BookingReviewIdentifierOptions
  ): Promise<BookingReview | null> {
    const { identifier, identifierType } = getBookingReviewOptions

    const GetBookingReviewIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getBookingReviewById(Number(identifier)),

      identifier: async () => await this.getBookingReviewByIdentifier(String(identifier)),
    }

    return await GetBookingReviewIdentifierOptions[identifierType]()
  }

  public static async updateBookingReviewRecord(
    updateBookingReviewRecordOptions: UpdateBookingReviewRecordOptions
  ): Promise<BookingReview | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateBookingReviewRecordOptions

    const bookingReview = await this.getBookingReview(identifierOptions)

    if (bookingReview === null) return null

    Object.assign(bookingReview, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      bookingReview.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await bookingReview.save()

    return bookingReview
  }

  public static async listBookingReviews(
    getBookingReviewRecordOptions: ListBookingReviewRecordsOptions
  ): Promise<{ bookingReviewPayload: BookingReview[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getBookingReviewRecordOptions

    const bookingReviewQuery = BookingReview.query()

    if (filterRecordOptionsPayload?.bookingId) {
      bookingReviewQuery.where('booking_id', filterRecordOptionsPayload.bookingId)
    }

    if (filterRecordOptionsPayload?.customerId) {
      bookingReviewQuery.where('customer_id', filterRecordOptionsPayload.customerId)
    }

    if (filterRecordOptionsPayload?.driverId) {
      bookingReviewQuery.where('driver_id', filterRecordOptionsPayload.driverId)
    }

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `%${filterRecordOptionsPayload.searchQuery}%`
      bookingReviewQuery.whereILike('review', searchValue)
    }

    if (paginationPayload) {
      const bookingReviews = await bookingReviewQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        bookingReviewPayload: bookingReviews.all(),
        paginationMeta: bookingReviews.getMeta(),
      }
    }

    const bookingReviews = await bookingReviewQuery.orderBy('created_at', 'desc')
    return {
      bookingReviewPayload: bookingReviews,
    }
  }
}
