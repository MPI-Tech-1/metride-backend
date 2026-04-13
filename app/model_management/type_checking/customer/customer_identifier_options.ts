type UserIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier' | 'email'
    }
  | {
      identifier: number

      identifierType: 'id'
    }

export default UserIdentifierOptions
