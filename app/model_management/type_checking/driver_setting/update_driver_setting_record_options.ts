import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type DriverSettingIdentifierOptions from '#model_management/type_checking/driver_setting/driver_setting_identifier_options'
import type DriverSettingInterface from '#model_management/type_checking/driver_setting/driver_setting_interface'

type UpdateDriverSettingRecordOptions = UpdateRecordGeneric<
  DriverSettingIdentifierOptions,
  Partial<DriverSettingInterface>
>

export default UpdateDriverSettingRecordOptions
