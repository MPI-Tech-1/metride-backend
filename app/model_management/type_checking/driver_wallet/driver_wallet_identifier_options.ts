import type DbTransactionOptions from '#common/type_checkings/model_management/db_transaction_options'

type DriverWalletIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
      dbTransactionOptions?: DbTransactionOptions
    }
  | {
      identifier: number

      identifierType: 'id' | 'driverId'

      dbTransactionOptions?: DbTransactionOptions
    }

export default DriverWalletIdentifierOptions
