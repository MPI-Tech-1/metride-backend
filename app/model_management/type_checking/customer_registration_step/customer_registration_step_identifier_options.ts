type CustomerRegistrationStepIdentifierOptions =
  | {
      identifier: string

      identifierType: 'identifier'
    }
  | {
      identifier: number

      identifierType: 'id' | 'customerId'
    }

export default CustomerRegistrationStepIdentifierOptions
