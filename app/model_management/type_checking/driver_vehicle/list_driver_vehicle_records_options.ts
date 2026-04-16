import ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverVehicleRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListDriverVehicleRecordsOptions =
  ListRecordsGeneric<ListDriverVehicleRecordsOptionsFilterOptions>

export default ListDriverVehicleRecordsOptions
