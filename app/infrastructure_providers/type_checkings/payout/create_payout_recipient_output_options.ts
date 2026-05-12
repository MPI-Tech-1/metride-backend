type CreatePayoutRecipientOutputOptions = {
  transferRecipientInformation: {
    accountName: string

    accountNumber: string

    bankCode: string

    providerRecipientCode: string
  } | null

  infrastructureResults: Record<string, any>
}

export default CreatePayoutRecipientOutputOptions
