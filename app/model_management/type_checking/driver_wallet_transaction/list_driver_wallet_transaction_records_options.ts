import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type FilterDriverWalletTransactionRecordOptionsPayload = {
  driverWalletId?: number

  driverId?: number

  typeOfTransaction?: 'debit' | 'credit'

  status?: 'pending' | 'completed' | 'failed'

  searchQuery?: string
}

type ListDriverWalletTransactionRecordsOptions =
  ListRecordsGeneric<FilterDriverWalletTransactionRecordOptionsPayload>

export default ListDriverWalletTransactionRecordsOptions
