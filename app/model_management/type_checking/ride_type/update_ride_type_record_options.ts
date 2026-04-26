import UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import RideTypeIdentifierOptions from '#model_management/type_checking/ride_type/ride_type_identifier_options'
import RideTypeInterface from '#model_management/type_checking/ride_type/ride_type_interface'

type UpdateRideTypeRecordOptions = UpdateRecordGeneric<
  RideTypeIdentifierOptions,
  Partial<RideTypeInterface>
>

export default UpdateRideTypeRecordOptions
