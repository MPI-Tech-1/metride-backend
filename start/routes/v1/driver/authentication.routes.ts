import router from '@adonisjs/core/services/router'

const DriverOnboardingController = () =>
  import('#controllers/v1/driver/authentication/onboarding_controller')

const AuthenticateDriverController = () =>
  import('#controllers/v1/driver/authentication/authenticate_driver_controller')

router
  .group(() => {
    router.post('/onboarding', [DriverOnboardingController])
    router.post('/authenticate', [AuthenticateDriverController])
  })
  .prefix('/api/v1/drivers/authentication')
  .as('driver.authentication')
