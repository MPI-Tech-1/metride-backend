import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverSettingsRecordsFilterOptions = {
  driverId?: number
}

type ListDriverSettingsRecordsOptions = ListRecordsGeneric<ListDriverSettingsRecordsFilterOptions>

export default ListDriverSettingsRecordsOptions
