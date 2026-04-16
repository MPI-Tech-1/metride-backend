type DriverPersonalInformationIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number

      identifierType: 'id' | 'driverId'
    }

export default DriverPersonalInformationIdentifierOptions
