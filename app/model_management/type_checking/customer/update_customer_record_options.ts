import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type CustomerIdentifierOptions from '#model_management/type_checking/customer/customer_identifier_options'
import type CustomerInterface from '#model_management/type_checking/customer/customer_interface'

type UpdateCustomerRecordOptions = UpdateRecordGeneric<
  CustomerIdentifierOptions,
  Partial<CustomerInterface>
>

export default UpdateCustomerRecordOptions
