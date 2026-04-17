import router from '@adonisjs/core/services/router'

const FetchBanksController = () => import('#controllers/v1/common/finance/fetch_banks_controller')

router
  .group(() => {
    router.get('/banks', [FetchBanksController])
  })
  .prefix('/api/v1/common/finance')
  .as('common.finance')
