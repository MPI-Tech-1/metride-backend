import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListRideTypeRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListRideTypeRecordsOptions = ListRecordsGeneric<ListRideTypeRecordsOptionsFilterOptions>

export default ListRideTypeRecordsOptions
