import router from '@adonisjs/core/services/router'

const RequestResetPasswordOtpTokenController = () =>
  import(
    '#controllers/v1/customer/password_management/reset_password/request_reset_password_otp_token_controller'
  )

const ResetPasswordController = () =>
  import(
    '#controllers/v1/customer/password_management/reset_password/reset_password_controller'
  )

router
  .group(() => {
    router.post('/request-otp-token', [RequestResetPasswordOtpTokenController])
    router.post('/reset', [ResetPasswordController])
  })
  .prefix('/v1/customers/password-management')
