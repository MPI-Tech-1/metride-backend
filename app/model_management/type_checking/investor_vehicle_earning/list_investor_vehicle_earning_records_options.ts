import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListInvestorVehicleEarningRecordsOptionsFilterOptions = {
  searchQuery?: string
  investorVehicleId?: number
  status?: 'pending' | 'paid'
}

type ListInvestorVehicleEarningRecordsOptions =
  ListRecordsGeneric<ListInvestorVehicleEarningRecordsOptionsFilterOptions>

export default ListInvestorVehicleEarningRecordsOptions
