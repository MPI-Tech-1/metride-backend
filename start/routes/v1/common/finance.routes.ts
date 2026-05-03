const ProcessPaystackWebhookController = () =>
  import('#controllers/v1/common/finance/process_paystack_webhook_controller')
import router from '@adonisjs/core/services/router'

const FetchBanksController = () => import('#controllers/v1/common/finance/fetch_banks_controller')

router
  .group(() => {
    router.get('/banks', [FetchBanksController])

    router.post('/webhooks/paystack', [ProcessPaystackWebhookController])
  })
  .prefix('/api/v1/common/finance')
  .as('common.finance')
