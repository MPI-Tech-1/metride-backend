type InitiatePayoutTransactionOutputOptions = {
  infrastructureResults: Record<string, any>

  initiatedPayoutTransactionInformation: {
    reference: string
  } | null
}

export default InitiatePayoutTransactionOutputOptions
