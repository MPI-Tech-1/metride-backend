import router from '@adonisjs/core/services/router'

const AuthenticateAdminController = () =>
  import('#controllers/v1/admin/authentication/authenticate_admin_controller')

router
  .group(() => {
    router.post('/authenticate', [AuthenticateAdminController])
  })
  .prefix('/api/v1/admins/authentication')
  .as('admin.authentication')
