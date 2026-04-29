import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type DriverVehicleIdentifierOptions from '#model_management/type_checking/driver_vehicle/driver_vehicle_identifier_options'
import type DriverVehicleInterface from '#model_management/type_checking/driver_vehicle/driver_vehicle_interface'

type UpdateDriverVehicleRecordOptions = UpdateRecordGeneric<
  DriverVehicleIdentifierOptions,
  Partial<DriverVehicleInterface>
>

export default UpdateDriverVehicleRecordOptions
