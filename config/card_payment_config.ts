import env from '#start/env'

const cardPaymentConfig = {
  currentProvider: env.get('CURRENT_CARD_PAYMENT_PROVIDER'),
  paystack: {
    identifier: 'paystack',
    initiateTransactionEndpoint: env.get(
      'PAYSTACK_CARD_PAYMENT_PROVIDER_INTITIATE_TRANSACTION_ENDPOINT'
    ),
    verifyTransactionEndpoint: env.get(
      'PAYSTACK_CARD_PAYMENT_PROVIDER_VERIFY_TRANSACTION_ENDPOINT'
    ),
    secretKey: env.get('PAYSTACK_CARD_PAYMENT_PROVIDER_SECRET_KEY'),
  },
}

export default cardPaymentConfig
