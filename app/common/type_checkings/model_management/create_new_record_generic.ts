import type DbTransactionOptions from '#common/type_checkings/model_management/db_transaction_options'

/*
|-------------------------------------------------------------------------------
| The Generic Shape of the object passed into the create method of Action Classes
|-------------------------------------------------------------------------------
*/
type CreateNewRecordGeneric<CreateRecordPayloadType> = {
  /**
   * This value defines the data to create the record with.
   */
  createPayload: CreateRecordPayloadType

  /**
   * This value defines the database transaction options.
   */
  dbTransactionOptions: DbTransactionOptions
}

export default CreateNewRecordGeneric
