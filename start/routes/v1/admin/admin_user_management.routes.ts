import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AdminRoleEnum from '#common/enums/admin_role_enum'

const CreateAdminController = () =>
  import('#controllers/v1/admin/user_management/create_admin_controller')
const FetchAdminsController = () =>
  import('#controllers/v1/admin/user_management/fetch_admins_controller')
const GetAdminController = () =>
  import('#controllers/v1/admin/user_management/get_admin_controller')
const DeleteAdminController = () =>
  import('#controllers/v1/admin/user_management/delete_admin_controller')

router
  .group(() => {
    router.post('/', [CreateAdminController])
    router.get('/', [FetchAdminsController])
    router.get('/:identifier', [GetAdminController])
    router.delete('/:identifier', [DeleteAdminController])
  })
  .prefix('/api/v1/admins/user-management')
  .as('admin.user_management')
  .use(middleware.auth({ guards: ['admin'] }))
  .use(middleware.adminRole({ roles: [AdminRoleEnum.ADMIN] }))
