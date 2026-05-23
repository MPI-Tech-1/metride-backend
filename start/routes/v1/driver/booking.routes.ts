const UpdateDriverLocationController = () =>
  import('#controllers/v1/driver/booking_management/update_driver_location_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const FetchBookingsController = () =>
  import('#controllers/v1/driver/booking_management/fetch_bookings_controller')
const GetBookingController = () =>
  import('#controllers/v1/driver/booking_management/get_booking_controller')
const AcceptBookingController = () =>
  import('#controllers/v1/driver/booking_management/accept_booking_controller')
const RejectBookingController = () =>
  import('#controllers/v1/driver/booking_management/reject_booking_controller')
const UpdateBookingTripProgressController = () =>
  import('#controllers/v1/driver/booking_management/update_booking_trip_progress_controller')
const EnableRideAcceptanceStatusController = () =>
  import('#controllers/v1/driver/booking_management/enable_ride_acceptance_status')
const DisableRideAcceptanceStatusController = () =>
  import('#controllers/v1/driver/booking_management/disable_ride_acceptance_status')

router
  .group(() => {
    router.get('/bookings', [FetchBookingsController])
    router.get('/bookings/:identifier', [GetBookingController])
    router.patch('/bookings/:identifier/accept', [AcceptBookingController])
    router.patch('/bookings/:identifier/reject', [RejectBookingController])
    router.patch('/bookings/:identifier/trip-progress', [UpdateBookingTripProgressController])
    router.patch('/ride-acceptance/enable', [EnableRideAcceptanceStatusController])
    router.patch('/ride-acceptance/disable', [DisableRideAcceptanceStatusController])
    router.post('/driver-locations', [UpdateDriverLocationController])
  })
  .use(middleware.auth({ guards: ['driver'] }))
  .as('driver.bookings')
  .prefix('api/v1/driver')
