import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FetchWalletTransactionsController = () =>
  import('#controllers/v1/admin/wallet/driver/fetch_wallet_transactions_controller')
const GetWalletTransactionController = () =>
  import('#controllers/v1/admin/wallet/driver/get_wallet_transaction_controller')
const FetchWalletWithdrawalRequestsController = () =>
  import('#controllers/v1/admin/wallet/driver/fetch_wallet_withdrawal_requests_controller')
const ApproveWalletPayoutController = () =>
  import('#controllers/v1/admin/wallet/driver/approve_wallet_payout_controller')
const RejectWalletPayoutController = () =>
  import('#controllers/v1/admin/wallet/driver/reject_wallet_payout_controller')

router
  .group(() => {
    router.get('/driver/transactions', [FetchWalletTransactionsController])
    router.get('/driver/transactions/:transactionIdentifier', [GetWalletTransactionController])
    router.get('/driver/withdrawal-requests', [FetchWalletWithdrawalRequestsController])
    router.post('/driver/withdrawal-requests/:withdrawalRequestIdentifier/approve', [
      ApproveWalletPayoutController,
    ])
    router.post('/driver/withdrawal-requests/:withdrawalRequestIdentifier/reject', [
      RejectWalletPayoutController,
    ])
  })
  .prefix('/api/v1/admins/wallet-management')
  .as('admin.wallet_management')
  .use(middleware.auth({ guards: ['admin'] }))
