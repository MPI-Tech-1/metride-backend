import router from '@adonisjs/core/services/router'

const OnboardingController = () =>
  import('#controllers/v1/customer/authentication/onboarding_controller')

router
  .group(() => {
    router.post('/onboarding', [OnboardingController])
  })
  .prefix('/v1/customers/authentication')
