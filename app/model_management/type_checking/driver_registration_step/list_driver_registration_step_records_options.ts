import ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverRegistrationStepRecordsFilterOptions = {
  driverId?: number

  hasActivatedAccount?: boolean
}

type ListDriverRegistrationStepRecordsOptions =
  ListRecordsGeneric<ListDriverRegistrationStepRecordsFilterOptions>

export default ListDriverRegistrationStepRecordsOptions
