import type DbTransactionOptions from '#common/type_checkings/model_management/db_transaction_options'

type DriverWalletWithdrawalRequestIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
      dbTransactionOptions?: DbTransactionOptions
    }
  | {
      identifier: number
      identifierType: 'id'
      dbTransactionOptions?: DbTransactionOptions
    }

export default DriverWalletWithdrawalRequestIdentifierOptions
