import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CreateRideTypeController = () =>
  import('#controllers/v1/admin/settings/booking/ride_types/create_ride_type_controller')
const UpdateRideTypeController = () =>
  import('#controllers/v1/admin/settings/booking/ride_types/update_ride_type_controller')
const FetchRideTypesController = () =>
  import('#controllers/v1/admin/settings/booking/ride_types/fetch_ride_types_controller')
const GetRideTypeController = () =>
  import('#controllers/v1/admin/settings/booking/ride_types/get_ride_type_controller')

const CreatePopularLocationController = () =>
  import('#controllers/v1/admin/settings/booking/popular_locations/create_popular_location_controller')
const UpdatePopularLocationController = () =>
  import('#controllers/v1/admin/settings/booking/popular_locations/update_popular_location_controller')
const FetchPopularLocationsController = () =>
  import('#controllers/v1/admin/settings/booking/popular_locations/fetch_popular_locations_controller')
const GetPopularLocationController = () =>
  import('#controllers/v1/admin/settings/booking/popular_locations/get_popular_location_controller')

router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.post('/', [CreateRideTypeController])
            router.patch('/:identifier', [UpdateRideTypeController])
            router.get('/', [FetchRideTypesController])
            router.get('/:identifier', [GetRideTypeController])
          })
          .prefix('/ride-types')
        router
          .group(() => {
            router.post('/', [CreatePopularLocationController])
            router.patch('/:identifier', [UpdatePopularLocationController])
            router.get('/', [FetchPopularLocationsController])
            router.get('/:identifier', [GetPopularLocationController])
          })
          .prefix('/popular-locations')
      })
      .prefix('/booking')
  })
  .prefix('/api/v1/admins/settings')
  .as('admin.settings')
  .use(middleware.auth({ guards: ['admin'] }))
