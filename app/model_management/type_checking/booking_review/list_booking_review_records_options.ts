import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

export interface BookingReviewFilterOptions {
  bookingId?: number

  customerId?: number

  driverId?: number

  searchQuery?: string
}

type ListBookingReviewRecordsOptions = ListRecordsGeneric<BookingReviewFilterOptions>

export default ListBookingReviewRecordsOptions
