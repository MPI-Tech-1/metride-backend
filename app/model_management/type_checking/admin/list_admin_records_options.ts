import ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListAdminRecordsOptionsFilterOptions = {
  searchQuery?: string

  isActive?: boolean
}

type ListAdminRecordsOptions = ListRecordsGeneric<ListAdminRecordsOptionsFilterOptions>

export default ListAdminRecordsOptions
