import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const Authenticate = () =>
  import('#controllers/v1/mvest/authentication/authenticate_mvest_owner_controller')
const Dashboard = () => import('#controllers/v1/mvest/dashboard/get_mvest_dashboard_controller')
const Vehicles = () => import('#controllers/v1/mvest/vehicles/fetch_mvest_vehicles_controller')
const Earnings = () =>
  import('#controllers/v1/mvest/earnings/fetch_mvest_owner_earnings_controller')
const Profile = () => import('#controllers/v1/mvest/profile/get_mvest_profile_controller')
const UpdateProfile = () => import('#controllers/v1/mvest/profile/update_mvest_profile_controller')

router.post('/api/v1/mvest/auth/login', [Authenticate]).as('mvest.auth.login')
router
  .group(() => {
    router.get('/dashboard', [Dashboard])
    router.get('/vehicles', [Vehicles])
    router.get('/earnings', [Earnings])
    router.get('/profile', [Profile])
    router.patch('/profile', [UpdateProfile])
  })
  .prefix('/api/v1/mvest')
  .as('mvest')
  .use(middleware.auth({ guards: ['mvestOwner'] }))
