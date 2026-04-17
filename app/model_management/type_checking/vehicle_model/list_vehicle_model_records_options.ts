import ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListVehicleModelRecordsOptionsFilterOptions = {
  vehicleMakeId?: number

  searchQuery?: string
}

type ListVehicleModelRecordsOptions =
  ListRecordsGeneric<ListVehicleModelRecordsOptionsFilterOptions>

export default ListVehicleModelRecordsOptions
