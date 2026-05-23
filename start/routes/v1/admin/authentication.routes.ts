import router from '@adonisjs/core/services/router'

const AuthenticateAdminController = () =>
  import('#controllers/v1/admin/authentication/authenticate_admin_controller')
const RequestAdminPasswordResetController = () =>
  import('#controllers/v1/admin/authentication/request_admin_password_reset_controller')
const ResetAdminPasswordController = () =>
  import('#controllers/v1/admin/authentication/reset_admin_password_controller')

router
  .group(() => {
    router.post('/authenticate', [AuthenticateAdminController])
    router.post('/request-password-reset', [RequestAdminPasswordResetController])
    router.post('/reset-password', [ResetAdminPasswordController])
  })
  .prefix('/api/v1/admins/authentication')
  .as('admin.authentication')
