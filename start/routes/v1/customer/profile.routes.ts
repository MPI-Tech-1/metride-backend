import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const GetCustomerProfileController = () =>
  import('#controllers/v1/customer/profile/get_customer_profile_controller')
const UpdateCustomerProfileController = () =>
  import('#controllers/v1/customer/profile/update_customer_profile_controller')
const FetchCustomerRideStatisticsController = () =>
  import('#controllers/v1/customer/profile/fetch_customer_ride_statistics_controller')

router
  .group(() => {
    router.get('/ride-statistics', [FetchCustomerRideStatisticsController]).as('fetch_ride_statistics')
    router.get('/', [GetCustomerProfileController]).as('get_profile')
    router.patch('/', [UpdateCustomerProfileController]).as('update_profile')
  })
  .prefix('api/v1/customer/profile')
  .as('customer.profile')
  .use(middleware.auth({ guards: ['customer'] }))
