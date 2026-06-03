type InvestorVehicleEarningIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number
      identifierType: 'id'
    }

export default InvestorVehicleEarningIdentifierOptions
