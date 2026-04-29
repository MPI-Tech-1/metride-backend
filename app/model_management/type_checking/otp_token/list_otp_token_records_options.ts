import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListOtpTokenRecordsFilterOptions = {
  email?: string

  purpose?: string

  status?: string
}

type ListOtpTokenRecordsOptions = ListRecordsGeneric<ListOtpTokenRecordsFilterOptions>

export default ListOtpTokenRecordsOptions
