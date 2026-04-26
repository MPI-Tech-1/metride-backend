import ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListCustomerRecordsOptionsFilterOptions = {
  searchQuery?: string

  isActive?: boolean
}

type ListCustomerRecordsOptions = ListRecordsGeneric<ListCustomerRecordsOptionsFilterOptions>

export default ListCustomerRecordsOptions
