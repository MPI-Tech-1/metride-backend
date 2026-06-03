type InvestorIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number
      identifierType: 'id'
    }

export default InvestorIdentifierOptions
