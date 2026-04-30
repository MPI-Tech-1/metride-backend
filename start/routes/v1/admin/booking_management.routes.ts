import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const CancelBookingController = () =>
  import('#controllers/v1/admin/booking_management/cancel_booking_controller')
const CompleteBookingController = () =>
  import('#controllers/v1/admin/booking_management/complete_booking_controller')

const FetchBookingsController = () =>
  import('#controllers/v1/admin/booking_management/fetch_bookings_controller')
const GetBookingController = () =>
  import('#controllers/v1/admin/booking_management/get_booking_controller')
const AssignBookingDriverController = () =>
  import('#controllers/v1/admin/booking_management/assign_booking_driver_controller')

router
  .group(() => {
    router.get('/', [FetchBookingsController])
    router.get('/:identifier', [GetBookingController])
    router.patch('/:identifier/assign-driver', [AssignBookingDriverController])
    router.patch('/:identifier/cancel', [CancelBookingController])
    router.patch('/:identifier/complete', [CompleteBookingController])
  })
  .prefix('api/v1/admins/bookings')
  .as('admin.bookings')
  .use(middleware.auth({ guards: ['admin'] }))
