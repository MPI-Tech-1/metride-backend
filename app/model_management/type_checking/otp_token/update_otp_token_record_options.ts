import UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import OtpTokenIdentifierOptions from '#model_management/type_checking/otp_token/otp_token_identifier_options'
import OtpTokenInterface from '#model_management/type_checking/otp_token/otp_token_interface'

type UpdateOtpTokenRecordOptions = UpdateRecordGeneric<
  OtpTokenIdentifierOptions,
  Partial<OtpTokenInterface>
>

export default UpdateOtpTokenRecordOptions
