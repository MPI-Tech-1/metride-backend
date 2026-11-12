type DriverBookingAssignmentIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number
      identifierType: 'id'
    }

export default DriverBookingAssignmentIdentifierOptions
