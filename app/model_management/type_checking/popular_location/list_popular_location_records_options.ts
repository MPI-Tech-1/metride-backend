import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListPopularLocationRecordsOptionsFilterOptions = {
  searchQuery?: string
  cityId?: number
  isActive?: boolean
  typeOfLocation?: string
}

type ListPopularLocationRecordsOptions =
  ListRecordsGeneric<ListPopularLocationRecordsOptionsFilterOptions>

export default ListPopularLocationRecordsOptions
