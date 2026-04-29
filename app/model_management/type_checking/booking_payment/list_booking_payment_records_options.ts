import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListBookingPaymentRecordsOptionsFilterOptions = {
  searchQuery?: string
  bookingId?: number
}

type ListBookingPaymentRecordsOptions =
  ListRecordsGeneric<ListBookingPaymentRecordsOptionsFilterOptions>

export default ListBookingPaymentRecordsOptions
