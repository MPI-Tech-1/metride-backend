import type AdminInterface from '#model_management/type_checking/admin/admin_interface'
import type CreateNewRecordGeneric from '#common/type_checkings/model_management/create_new_record_generic'

type CreateAdminRecordPayload = Partial<AdminInterface>

type CreateAdminRecordOptions = CreateNewRecordGeneric<CreateAdminRecordPayload>

export default CreateAdminRecordOptions
