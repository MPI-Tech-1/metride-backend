import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverDocumentRecordsOptionsFilterOptions = {
  searchQuery?: string
}

type ListDriverDocumentRecordsOptions =
  ListRecordsGeneric<ListDriverDocumentRecordsOptionsFilterOptions>

export default ListDriverDocumentRecordsOptions
