import ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListCustomerRegistrationStepRecordsFilterOptions = {
  customerId?: number

  hasActivatedAccount?: boolean
}

type ListCustomerRegistrationStepRecordsOptions =
  ListRecordsGeneric<ListCustomerRegistrationStepRecordsFilterOptions>

export default ListCustomerRegistrationStepRecordsOptions
