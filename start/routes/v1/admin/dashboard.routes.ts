import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FetchCustomerMetricsController = () =>
  import('#controllers/v1/admin/dashboard/fetch_customer_metrics_controller')
const FetchDriverMetricsController = () =>
  import('#controllers/v1/admin/dashboard/fetch_driver_metrics_controller')
const FetchBookingMetricsController = () =>
  import('#controllers/v1/admin/dashboard/fetch_booking_metrics_controller')
const FetchPayoutMetricsController = () =>
  import('#controllers/v1/admin/dashboard/fetch_payout_metrics_controller')
const FetchWalletTransactionMetricsController = () =>
  import('#controllers/v1/admin/dashboard/fetch_wallet_transaction_metrics_controller')

router
  .group(() => {
    router.get('/customer-metrics', [FetchCustomerMetricsController])
    router.get('/driver-metrics', [FetchDriverMetricsController])
    router.get('/booking-metrics', [FetchBookingMetricsController])
    router.get('/payout-metrics', [FetchPayoutMetricsController])
    router.get('/wallet-transaction-metrics', [FetchWalletTransactionMetricsController])
  })
  .prefix('/api/v1/admins/dashboard')
  .as('admin.dashboard')
  .use(middleware.auth({ guards: ['admin'] }))
