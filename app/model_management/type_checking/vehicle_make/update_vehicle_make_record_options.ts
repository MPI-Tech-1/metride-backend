import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type VehicleMakeIdentifierOptions from '#model_management/type_checking/vehicle_make/vehicle_make_identifier_options'
import type VehicleMakeInterface from '#model_management/type_checking/vehicle_make/vehicle_make_interface'

type UpdateVehicleMakeRecordOptions = UpdateRecordGeneric<
  VehicleMakeIdentifierOptions,
  Partial<VehicleMakeInterface>
>

export default UpdateVehicleMakeRecordOptions
