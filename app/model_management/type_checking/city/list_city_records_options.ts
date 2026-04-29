import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListCityRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListCityRecordsOptions = ListRecordsGeneric<ListCityRecordsOptionsFilterOptions>

export default ListCityRecordsOptions
