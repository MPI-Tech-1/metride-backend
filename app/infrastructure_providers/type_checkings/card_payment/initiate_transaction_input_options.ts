type InitiateTransactionInputOptions = {
  amount: string

  paymentChannel?: Array<
    'card' | 'bank' | 'apple_pay' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer' | 'eft'
  >

  emailAddress: string

  cancelTransactionRedirectUrl?: string

  redirectTransactionRedirectUrl?: string

  metadata?: Record<string, any>
}

export default InitiateTransactionInputOptions
