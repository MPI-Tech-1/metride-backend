import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListBookingRecordsOptionsFilterOptions = {
  searchQuery?: string
  rideTypeId?: number
  isRecurringBooking?: boolean
  typeOfBooking?: 'instant' | 'shuttle'
  status?: 'created' | 'assigned-a-driver' | 'accepted' | 'completed' | 'cancelled' | 'rejected'
  customerId?: number
  assignedDriverId?: number
}

type ListBookingRecordsOptions = ListRecordsGeneric<ListBookingRecordsOptionsFilterOptions>

export default ListBookingRecordsOptions
