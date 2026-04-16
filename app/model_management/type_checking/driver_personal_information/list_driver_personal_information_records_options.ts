import ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverPersonalInformationRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListDriverPersonalInformationRecordsOptions =
  ListRecordsGeneric<ListDriverPersonalInformationRecordsOptionsFilterOptions>

export default ListDriverPersonalInformationRecordsOptions
