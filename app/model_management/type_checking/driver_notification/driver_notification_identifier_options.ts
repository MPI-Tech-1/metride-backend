type DriverNotificationIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number
      identifierType: 'id'
    }

export default DriverNotificationIdentifierOptions
