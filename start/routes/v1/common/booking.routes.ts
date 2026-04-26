import router from '@adonisjs/core/services/router'

const FetchRideTypesController = () =>
  import('#controllers/v1/common/booking/fetch_ride_types_controller')

router
  .group(() => {
    router.get('/ride-types', [FetchRideTypesController])
  })
  .prefix('/api/v1/common/bookings')
  .as('common.bookings')
