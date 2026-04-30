import { type DateTime } from 'luxon'

type InitiateTransactionOutputOptions = {
  transactionStatus: 'success' | 'pending' | 'failed'
  infrastructureResults?: any
  initiateTransactionInformation: {
    checkoutUrl: string
    transactionReference: string
    amount: number
    transactionDate: DateTime
  } | null
}

export default InitiateTransactionOutputOptions
