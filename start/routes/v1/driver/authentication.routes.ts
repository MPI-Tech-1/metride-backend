import router from '@adonisjs/core/services/router'

const OnboardingController = () =>
  import('#controllers/v1/driver/authentication/onboarding_controller')

const AuthenticateDriverController = () =>
  import('#controllers/v1/driver/authentication/authenticate_driver_controller')

router
  .group(() => {
    router.post('/onboarding', [OnboardingController])
    router.post('/authenticate', [AuthenticateDriverController])
  })
  .prefix('/v1/drivers/authentication')
