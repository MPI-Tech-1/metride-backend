type DriverLocationIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number
      identifierType: 'id'
    }
  | {
      identifier: number
      identifierType: 'driverId'
    }

export default DriverLocationIdentifierOptions
