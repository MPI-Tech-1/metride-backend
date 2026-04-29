import type DbTransactionOptions from '#common/type_checkings/model_management/db_transaction_options'

/*
|-------------------------------------------------------------------------------
| The Generic Shape of the object passed into the update method of Action Classes
|-------------------------------------------------------------------------------
*/
type UpdateRecordGeneric<RecordIdentifierOptions, UpdateRecordPayload> = {
  /**
   * This value defines the data to fetch the record with.
   */
  identifierOptions: RecordIdentifierOptions

  /**
   * This value defines the data to create the record with.
   */
  updatePayload: UpdateRecordPayload

  /**
   * This value defines the database transaction options.
   */
  dbTransactionOptions: DbTransactionOptions
}

export default UpdateRecordGeneric
