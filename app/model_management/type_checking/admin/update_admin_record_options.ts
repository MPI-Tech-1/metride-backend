import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type AdminIdentifierOptions from '#model_management/type_checking/admin/admin_identifier_options'
import type AdminInterface from '#model_management/type_checking/admin/admin_interface'

type UpdateAdminRecordOptions = UpdateRecordGeneric<AdminIdentifierOptions, Partial<AdminInterface>>

export default UpdateAdminRecordOptions
