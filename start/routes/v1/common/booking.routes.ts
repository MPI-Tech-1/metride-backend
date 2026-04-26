import router from '@adonisjs/core/services/router'

const FetchRideTypesController = () =>
  import('#controllers/v1/common/booking/fetch_ride_types_controller')

const FetchPopularLocationsController = () =>
  import('#controllers/v1/common/booking/fetch_popular_locations_controller')

router
  .group(() => {
    router.get('/ride-types', [FetchRideTypesController])
    router.get('/popular-locations', [FetchPopularLocationsController])
  })
  .prefix('/api/v1/common/bookings')
  .as('common.bookings')
