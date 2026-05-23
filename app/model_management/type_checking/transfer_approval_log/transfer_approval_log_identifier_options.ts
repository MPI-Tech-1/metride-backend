type TransferApprovalLogIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number
      identifierType: 'id'
    }

export default TransferApprovalLogIdentifierOptions
