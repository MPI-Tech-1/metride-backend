import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AdminRoleEnum from '#common/enums/admin_role_enum'

const CreatePromotionController = () =>
  import('#controllers/v1/admin/promotions/create_promotion_controller')
const FetchPromotionsController = () =>
  import('#controllers/v1/admin/promotions/fetch_promotions_controller')
const UpdatePromotionController = () =>
  import('#controllers/v1/admin/promotions/update_promotion_controller')

router
  .group(() => {
    router.post('/', [CreatePromotionController])
    router.get('/', [FetchPromotionsController])
    router.patch('/:identifier', [UpdatePromotionController])
  })
  .prefix('/api/v1/admins/promotions')
  .as('admin.promotions')
  .use(middleware.auth({ guards: ['admin'] }))
  .use(middleware.adminRole({ roles: [AdminRoleEnum.ADMIN, AdminRoleEnum.OPERATIONS] }))
