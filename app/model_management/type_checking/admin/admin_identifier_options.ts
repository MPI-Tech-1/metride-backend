type AdminIdentifierOptions =
  | {
      identifier: string

      identifierType: 'identifier' | 'email'
    }
  | {
      identifier: number

      identifierType: 'id'
    }

export default AdminIdentifierOptions
