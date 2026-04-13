import CustomerInterface from '#model_management/type_checking/customer/customer_interface'
import CreateNewRecordGeneric from '#common/type_checkings/model_management/create_new_record_generic'

type CreateUserRecordPayload = Partial<CustomerInterface>

type CreateUserRecordOptions = CreateNewRecordGeneric<CreateUserRecordPayload>

export default CreateUserRecordOptions
