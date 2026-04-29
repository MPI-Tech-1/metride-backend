import type OtpTokenInterface from '#model_management/type_checking/otp_token/otp_token_interface'
import type CreateNewRecordGeneric from '#common/type_checkings/model_management/create_new_record_generic'

type CreateOtpTokenRecordPayload = Partial<OtpTokenInterface>

type CreateOtpTokenRecordOptions = CreateNewRecordGeneric<CreateOtpTokenRecordPayload>

export default CreateOtpTokenRecordOptions
