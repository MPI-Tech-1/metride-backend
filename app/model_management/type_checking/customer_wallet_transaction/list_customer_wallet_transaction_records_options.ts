import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type FilterCustomerWalletTransactionRecordOptionsPayload = {
  searchQuery?: string
}

type ListCustomerWalletTransactionRecordsOptions =
  ListRecordsGeneric<FilterCustomerWalletTransactionRecordOptionsPayload>

export default ListCustomerWalletTransactionRecordsOptions
