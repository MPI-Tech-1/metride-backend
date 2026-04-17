import router from '@adonisjs/core/services/router'

const DriverRequestResetPasswordOtpTokenController = () =>
  import('#controllers/v1/driver/password_management/reset_password/request_reset_password_otp_token_controller')

const DriverResetPasswordController = () =>
  import('#controllers/v1/driver/password_management/reset_password/reset_password_controller')

router
  .group(() => {
    router.post('/request-otp-token', [DriverRequestResetPasswordOtpTokenController])
    router.post('/reset', [DriverResetPasswordController])
  })
  .prefix('/api/v1/drivers/password-management')
  .as('driver.password-management')
