import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

export interface BookingGpsLogFilterOptions {
  bookingId?: number
  customerId?: number
  driverId?: number
  searchQuery?: string
}

type ListBookingGpsLogRecordsOptions = ListRecordsGeneric<BookingGpsLogFilterOptions>

export default ListBookingGpsLogRecordsOptions
