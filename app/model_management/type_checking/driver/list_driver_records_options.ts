import ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverRecordsOptionsFilterOptions = {
  searchQuery?: string

  isActive?: boolean
}

type ListDriverRecordsOptions = ListRecordsGeneric<ListDriverRecordsOptionsFilterOptions>

export default ListDriverRecordsOptions
