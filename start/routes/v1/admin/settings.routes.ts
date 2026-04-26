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
      })
      .prefix('/booking')
  })
  .prefix('/api/v1/admins/settings')
  .as('admin.settings')
  .use(middleware.auth({ guards: ['admin'] }))
