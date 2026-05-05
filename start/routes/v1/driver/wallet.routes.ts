import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const GetWalletController = () => import('#controllers/v1/driver/wallet/get_wallet_controller')
const FetchWalletTransactionsController = () =>
  import('#controllers/v1/driver/wallet/fetch_wallet_transactions_controller')
const GetWalletTransactionController = () =>
  import('#controllers/v1/driver/wallet/get_wallet_transaction_controller')

router
  .group(() => {
    router.get('/wallet', [GetWalletController])
    router.get('/wallet/transactions', [FetchWalletTransactionsController])
    router.get('/wallet/transactions/:transactionIdentifier', [GetWalletTransactionController])
  })
  .use(middleware.auth({ guards: ['driver'] }))
  .as('driver.wallet')
  .prefix('api/v1/driver')
