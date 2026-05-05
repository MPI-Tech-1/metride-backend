import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverWalletWithdrawalRequestRecordsOptionsFilterOptions = {
  searchQuery?: string
  driverId?: number
  driverWalletId?: number
  status?: 'pending' | 'approved' | 'rejected'
}

type ListDriverWalletWithdrawalRequestRecordsOptions =
  ListRecordsGeneric<ListDriverWalletWithdrawalRequestRecordsOptionsFilterOptions>

export default ListDriverWalletWithdrawalRequestRecordsOptions
