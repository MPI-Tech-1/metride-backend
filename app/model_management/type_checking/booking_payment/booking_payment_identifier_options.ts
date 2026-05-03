type BookingPaymentIdentifierOptions =
  | {
      identifier: string
      identifierType: 'identifier' | 'paymentProviderReference'
    }
  | {
      identifier: number

      identifierType: 'id'
    }

export default BookingPaymentIdentifierOptions
