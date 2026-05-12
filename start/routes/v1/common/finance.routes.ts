const ProcessPaystackWebhookController = () =>
  import('#controllers/v1/common/finance/process_paystack_webhook_controller')
const ResolveAccountController = () =>
  import('#controllers/v1/common/finance/resolve_bank_account_controller')
const ProcessApprovePaystackTransactionController = () =>
  import('#controllers/v1/common/finance/approve_paystack_transaction_controller')
import router from '@adonisjs/core/services/router'

const FetchBanksController = () => import('#controllers/v1/common/finance/fetch_banks_controller')

router
  .group(() => {
    router.get('/banks', [FetchBanksController])

    router.get('/resolve-accounts', [ResolveAccountController])

    router.post('/approve-paystack-transaction', [ProcessApprovePaystackTransactionController])

    router.post('/webhooks/paystack', [ProcessPaystackWebhookController])
  })
  .prefix('/api/v1/common/finance')
  .as('common.finance')
