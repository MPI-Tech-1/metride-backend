import type DeleteRecordGeneric from '#common/type_checkings/model_management/delete_record_generic'
import type DriverVehiclePhotoIdentifierOptions from '#model_management/type_checking/driver_vehicle_photo/driver_vehicle_photo_identifier_options'

type DeleteDriverVehiclePhotoRecordOptions = DeleteRecordGeneric<
  DriverVehiclePhotoIdentifierOptions,
  {}
>

export default DeleteDriverVehiclePhotoRecordOptions
