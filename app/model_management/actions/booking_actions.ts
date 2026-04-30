import type CreateBookingRecordOptions from '#model_management/type_checking/booking/create_booking_record_options'
import type ListBookingRecordsOptions from '#model_management/type_checking/booking/list_booking_records_options'
import type UpdateBookingRecordOptions from '#model_management/type_checking/booking/update_booking_record_options'
import type BookingIdentifierOptions from '#model_management/type_checking/booking/booking_identifier_options'
import Booking from '#models/booking'

export default class BookingActions {
  public static async createBookingRecord(
    createBookingRecordOptions: CreateBookingRecordOptions
  ): Promise<Booking> {
    const { createPayload, dbTransactionOptions } = createBookingRecordOptions

    const booking = new Booking()
    Object.assign(booking, createPayload)

    if (dbTransactionOptions.useTransaction) {
      booking.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await booking.save()

    return booking
  }

  private static async getBookingById(bookingId: number): Promise<Booking | null> {
    return await Booking.query()
      .preload('rideType')
      .preload('customer')
      .preload('bookingPayment')
      .where('id', bookingId)
      .first()
  }

  private static async getBookingByIdentifier(bookingIdentifier: string): Promise<Booking | null> {
    return await Booking.query()
      .preload('rideType')
      .preload('customer')
      .preload('bookingPayment')
      .where('identifier', bookingIdentifier)
      .first()
  }

  public static async getBooking(
    getBookingOptions: BookingIdentifierOptions
  ): Promise<Booking | null> {
    const { identifier, identifierType } = getBookingOptions

    const GetBookingIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getBookingById(Number(identifier)),

      identifier: async () => await this.getBookingByIdentifier(String(identifier)),
    }

    return await GetBookingIdentifierOptions[identifierType]()
  }

  public static async updateBookingRecord(
    updateBookingRecordOptions: UpdateBookingRecordOptions
  ): Promise<Booking | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateBookingRecordOptions

    const booking = await this.getBooking(identifierOptions)

    if (booking === null) return null

    Object.assign(booking, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      booking.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await booking.save()

    return booking
  }

  public static async listBookings(
    getBookingRecordOptions: ListBookingRecordsOptions
  ): Promise<{ bookingPayload: Booking[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getBookingRecordOptions

    const bookingQuery = Booking.query()
      .preload('rideType')
      .preload('customer')
      .preload('bookingPayment')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      bookingQuery
        .whereILike('identifier', searchValue)
        .orWhereILike('departure_location_name', searchValue)
        .orWhereILike('destination_location_name', searchValue)
    }

    if (filterRecordOptionsPayload?.rideTypeId) {
      bookingQuery.where('ride_type_id', filterRecordOptionsPayload.rideTypeId)
    }

    if (filterRecordOptionsPayload?.isRecurringBooking !== undefined) {
      bookingQuery.where('is_recurring_booking', filterRecordOptionsPayload.isRecurringBooking)
    }

    if (filterRecordOptionsPayload?.typeOfBooking) {
      bookingQuery.where('type_of_booking', filterRecordOptionsPayload.typeOfBooking)
    }

    if (filterRecordOptionsPayload?.customerId) {
      bookingQuery.where('customer_id', filterRecordOptionsPayload.customerId)
    }

    if (paginationPayload) {
      const bookings = await bookingQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        bookingPayload: bookings.all(),
        paginationMeta: bookings.getMeta(),
      }
    }

    const bookings = await bookingQuery.orderBy('created_at', 'desc')
    return {
      bookingPayload: bookings,
    }
  }
}
