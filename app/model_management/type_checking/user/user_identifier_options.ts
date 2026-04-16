type UserIdentifierOptions =
  | {
      identifier: string
      identifierType: 'email'
    }
  | {
      identifier: number

      identifierType: 'id'
    }

export default UserIdentifierOptions
