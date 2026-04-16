import ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverBankAccountRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListDriverBankAccountRecordsOptions =
  ListRecordsGeneric<ListDriverBankAccountRecordsOptionsFilterOptions>

export default ListDriverBankAccountRecordsOptions
