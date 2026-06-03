import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListInvestorVehicleRecordsOptionsFilterOptions = {
  searchQuery?: string
  investorId?: number
}

type ListInvestorVehicleRecordsOptions =
  ListRecordsGeneric<ListInvestorVehicleRecordsOptionsFilterOptions>

export default ListInvestorVehicleRecordsOptions
