import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListTransferApprovalLogRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListTransferApprovalLogRecordsOptions =
  ListRecordsGeneric<ListTransferApprovalLogRecordsOptionsFilterOptions>

export default ListTransferApprovalLogRecordsOptions
