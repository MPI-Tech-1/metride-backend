/*
|-------------------------------------------------------------------------------
| The Generic Shape of the object passed into the get methods of Action Classes
|-------------------------------------------------------------------------------
*/
type ListRecordsGeneric<FilterRecordOptions> = {
  /**
   * This value defines the data to fetch the record with.
   */
  filterRecordOptionsPayload?: FilterRecordOptions

  /**
   * This value defines the number of records to be fetched and the associated page number of the record.
   */
  paginationPayload?: { page: number; limit: number }

  /**
   * This value defines how a records should be sorted and attribute to use for sorting
   */
  sortPayload?: {
    orderBy: 'id' | string
    sortBy: 'asc' | 'desc'
  }
}

export default ListRecordsGeneric
