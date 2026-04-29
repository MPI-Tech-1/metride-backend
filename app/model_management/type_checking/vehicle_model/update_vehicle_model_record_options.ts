import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type VehicleModelIdentifierOptions from '#model_management/type_checking/vehicle_model/vehicle_model_identifier_options'
import type VehicleModelInterface from '#model_management/type_checking/vehicle_model/vehicle_model_interface'

type UpdateVehicleModelRecordOptions = UpdateRecordGeneric<
  VehicleModelIdentifierOptions,
  Partial<VehicleModelInterface>
>

export default UpdateVehicleModelRecordOptions
