import env from '#start/env'

export default {
  currentProvider: env.get('CURRENT_ACCOUNT_INFO_PROVIDER'),
  paystack: {
    identifier: 'paystack',
    endpoint: env.get('PAYSTACK_ACCOUNT_INFO_ENDPOINT'),
    secretKey: env.get('PAYSTACK_ACCOUNT_INFO_SECRET_KEY'),
  },
}
