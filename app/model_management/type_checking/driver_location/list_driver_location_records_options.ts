import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type FilterDriverLocationRecordOptionsPayload = {
  driverId?: number
}

type ListDriverLocationRecordsOptions = ListRecordsGeneric<FilterDriverLocationRecordOptionsPayload>

export default ListDriverLocationRecordsOptions
