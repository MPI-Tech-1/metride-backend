type CustomerWalletTransactionIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number

      identifierType: 'id'
    }

export default CustomerWalletTransactionIdentifierOptions
