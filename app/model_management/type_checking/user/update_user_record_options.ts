import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type UserIdentifierOptions from '#model_management/type_checking/user/user_identifier_options'
import type UserInterface from '#model_management/type_checking/user/user_interface'

type UpdateUserRecordOptions = UpdateRecordGeneric<UserIdentifierOptions, Partial<UserInterface>>

export default UpdateUserRecordOptions
