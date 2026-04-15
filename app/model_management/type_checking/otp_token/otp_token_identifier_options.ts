type OtpTokenIdentifierOptions =
  | {
      identifier: string

      identifierType: 'identifier' | 'email'
    }
  | {
      identifier: number

      identifierType: 'id'
    }

export default OtpTokenIdentifierOptions
