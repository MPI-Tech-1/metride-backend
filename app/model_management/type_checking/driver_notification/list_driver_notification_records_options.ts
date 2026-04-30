import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type FilterDriverNotificationRecordOptionsPayload = {
  searchQuery?: string
  driverId?: number
  isNotificationRead?: boolean
}

type ListDriverNotificationRecordsOptions =
  ListRecordsGeneric<FilterDriverNotificationRecordOptionsPayload>

export default ListDriverNotificationRecordsOptions
