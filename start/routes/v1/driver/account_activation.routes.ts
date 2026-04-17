import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DriverRequestAccountActivationTokenController = () =>
  import('#controllers/v1/driver/account_activation/request_account_activation_token_controller')

const DriverVerifyAccountActivationTokenController = () =>
  import('#controllers/v1/driver/account_activation/verify_account_activation_token_controller')

router
  .group(() => {
    router.post('/request-token', [DriverRequestAccountActivationTokenController])
    router.post('/verify-token', [DriverVerifyAccountActivationTokenController])
  })
  .prefix('/api/v1/drivers/account-activation')
  .as('driver.account-activation')
  .use(middleware.auth({ guards: ['driver'] }))
