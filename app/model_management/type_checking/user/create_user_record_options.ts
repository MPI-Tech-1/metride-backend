import UserInterface from '#model_management/type_checking/user/user_interface'
import CreateNewRecordGeneric from '#common/type_checkings/model_management/create_new_record_generic'

type CreateUserRecordPayload = Partial<UserInterface>

type CreateUserRecordOptions = CreateNewRecordGeneric<CreateUserRecordPayload>

export default CreateUserRecordOptions
