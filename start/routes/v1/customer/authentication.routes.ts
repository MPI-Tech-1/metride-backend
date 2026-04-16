import router from '@adonisjs/core/services/router'

const OnboardingController = () =>
  import('#controllers/v1/customer/authentication/onboarding_controller')

const AuthenticateCustomerController = () =>
  import('#controllers/v1/customer/authentication/authenticate_customer_controller')

router
  .group(() => {
    router.post('/onboarding', [OnboardingController])
    router.post('/authenticate', [AuthenticateCustomerController])
  })
  .prefix('/v1/customers/authentication')
  .as('customer.authentication')
