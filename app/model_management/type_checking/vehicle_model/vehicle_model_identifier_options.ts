type VehicleModelIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number

      identifierType: 'id'
    }

export default VehicleModelIdentifierOptions
