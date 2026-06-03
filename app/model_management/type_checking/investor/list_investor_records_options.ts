import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListInvestorRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListInvestorRecordsOptions = ListRecordsGeneric<ListInvestorRecordsOptionsFilterOptions>

export default ListInvestorRecordsOptions
