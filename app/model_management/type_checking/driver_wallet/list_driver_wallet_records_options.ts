import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type FilterDriverWalletRecordOptionsPayload = {
  searchQuery?: string
}

type ListDriverWalletRecordsOptions = ListRecordsGeneric<FilterDriverWalletRecordOptionsPayload>

export default ListDriverWalletRecordsOptions
