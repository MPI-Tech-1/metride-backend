import env from '#start/env'

const bankListConfig = {
  currentProvider: env.get('CURRENT_BANK_LIST_PROVIDER'),
  paystack: {
    identifier: 'paystack',
    endpoint: env.get('PAYSTACK_BANK_LIST_PROVIDER_ENDPOINT'),
    secretKey: env.get('PAYSTACK_BANK_LIST_PROVIDER_SECRET_KEY'),
  },
}

export default bankListConfig
