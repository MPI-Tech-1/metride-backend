import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListVehicleMakeRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListVehicleMakeRecordsOptions = ListRecordsGeneric<ListVehicleMakeRecordsOptionsFilterOptions>

export default ListVehicleMakeRecordsOptions
