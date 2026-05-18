import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverVehiclePhotoRecordsOptionsFilterOptions = {
  driverId?: number
}

type ListDriverVehiclePhotoRecordsOptions =
  ListRecordsGeneric<ListDriverVehiclePhotoRecordsOptionsFilterOptions>

export default ListDriverVehiclePhotoRecordsOptions
