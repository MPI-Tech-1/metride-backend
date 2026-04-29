import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListUserRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListUserRecordsOptions = ListRecordsGeneric<ListUserRecordsOptionsFilterOptions>

export default ListUserRecordsOptions
