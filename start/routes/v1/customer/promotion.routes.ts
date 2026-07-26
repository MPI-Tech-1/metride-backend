import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const ValidatePromotionController = () =>
  import('#controllers/v1/customer/promotion/validate_promotion_controller')

router
  .group(() => {
    router.post('/validate', [ValidatePromotionController])
  })
  .use(middleware.auth({ guards: ['customer'] }))
  .prefix('/api/v1/customer/promotions')
  .as('customer.promotions')
