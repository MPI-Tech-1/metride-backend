import env from '#start/env'

export default {
  currentProvider: env.get('CURRENT_PAYOUT_PROVIDER'),
  paystack: {
    identifier: 'paystack',
    secretKey: env.get('PAYSTACK_PAYOUT_PROVIDER_SECRET_KEY'),
    createTransferRecipientEndpoint: env.get(
      'PAYSTACK_PAYOUT_PROVIDER_CREATE_TRANSFER_RECIPIENT_ENDPOINT'
    ),
    initiateTransferEndpoint: env.get('PAYSTACK_PAYOUT_PROVIDER_INITIATE_TRANSFER_ENDPOINT'),
  },
}
