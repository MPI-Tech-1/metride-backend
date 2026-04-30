import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type FilterCustomerNotificationRecordOptionsPayload = {
  searchQuery?: string
  customerId?: number
  isNotificationRead?: boolean
}

type ListCustomerNotificationRecordsOptions =
  ListRecordsGeneric<FilterCustomerNotificationRecordOptionsPayload>

export default ListCustomerNotificationRecordsOptions
