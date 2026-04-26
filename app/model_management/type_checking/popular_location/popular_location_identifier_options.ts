type PopularLocationIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier'
    }
  | {
      identifier: number

      identifierType: 'id'
    }

export default PopularLocationIdentifierOptions
