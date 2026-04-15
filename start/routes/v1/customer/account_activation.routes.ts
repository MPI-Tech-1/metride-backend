import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const RequestAccountActivationTokenController = () =>
  import(
    '#controllers/v1/customer/account_activation/request_account_activation_token_controller'
  )

const VerifyAccountActivationTokenController = () =>
  import(
    '#controllers/v1/customer/account_activation/verify_account_activation_token_controller'
  )

router
  .group(() => {
    router.post('/request-token', [RequestAccountActivationTokenController])
    router.post('/verify-token', [VerifyAccountActivationTokenController])
  })
  .prefix('/v1/customers/account-activation')
  .use(middleware.auth({ guards: ['customer'] }))
