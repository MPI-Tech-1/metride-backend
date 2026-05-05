import type DriverWalletInterface from '#model_management/type_checking/driver_wallet/driver_wallet_interface'
import type DriverWalletIdentifierOptions from '#model_management/type_checking/driver_wallet/driver_wallet_identifier_options'
import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'

type UpdateDriverWalletRecordPayload = Partial<DriverWalletInterface>

type UpdateDriverWalletRecordOptions = UpdateRecordGeneric<
  DriverWalletIdentifierOptions,
  UpdateDriverWalletRecordPayload
>

export default UpdateDriverWalletRecordOptions
