import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverApprovalStepRecordsFilterOptions = {
  driverId?: number
}

type ListDriverApprovalStepRecordsOptions =
  ListRecordsGeneric<ListDriverApprovalStepRecordsFilterOptions>

export default ListDriverApprovalStepRecordsOptions
