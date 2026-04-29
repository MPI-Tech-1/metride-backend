import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListBankRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListBankRecordsOptions = ListRecordsGeneric<ListBankRecordsOptionsFilterOptions>

export default ListBankRecordsOptions
