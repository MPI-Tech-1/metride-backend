import ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListBookingRecordsOptionsFilterOptions = {
  searchQuery?: string
  rideTypeId?: number
  isRecurringBooking?: boolean
  typeOfBooking?: 'instant' | 'shuttle'
}

type ListBookingRecordsOptions = ListRecordsGeneric<ListBookingRecordsOptionsFilterOptions>

export default ListBookingRecordsOptions
