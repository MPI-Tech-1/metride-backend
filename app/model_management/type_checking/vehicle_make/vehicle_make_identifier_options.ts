type VehicleMakeIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number

      identifierType: 'id'
    }

export default VehicleMakeIdentifierOptions
