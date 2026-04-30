import { type DateTime } from 'luxon'

type VerifyTransactionOutputOptions = {
  transactionStatus: 'success' | 'request-failed' | 'pending' | 'failed'
  infrastructureResults?: any
  transactionVerificationInformation: {
    transactionReference: string
    amount: number
    transactionDate: DateTime
  } | null
}

export default VerifyTransactionOutputOptions
