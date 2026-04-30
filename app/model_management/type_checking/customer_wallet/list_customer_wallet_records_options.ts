import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type FilterCustomerWalletRecordOptionsPayload = {
  searchQuery?: string
}

type ListCustomerWalletRecordsOptions = ListRecordsGeneric<FilterCustomerWalletRecordOptionsPayload>

export default ListCustomerWalletRecordsOptions
