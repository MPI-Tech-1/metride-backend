import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type DriverIdentifierOptions from '#model_management/type_checking/driver/driver_identifier_options'
import type DriverInterface from '#model_management/type_checking/driver/driver_interface'

type UpdateDriverRecordOptions = UpdateRecordGeneric<
  DriverIdentifierOptions,
  Partial<DriverInterface>
>

export default UpdateDriverRecordOptions
