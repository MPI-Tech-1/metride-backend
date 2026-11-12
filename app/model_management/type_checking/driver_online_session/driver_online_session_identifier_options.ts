type DriverOnlineSessionIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number
      identifierType: 'id' | 'driverId'
    }

export default DriverOnlineSessionIdentifierOptions
