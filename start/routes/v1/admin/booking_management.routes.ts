import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FetchBookingsController = () =>
  import('#controllers/v1/admin/booking_management/fetch_bookings_controller')
const GetBookingController = () =>
  import('#controllers/v1/admin/booking_management/get_booking_controller')

router
  .group(() => {
    router.get('/', [FetchBookingsController])
    router.get('/:identifier', [GetBookingController])
  })
  .prefix('api/v1/admins/bookings')
  .as('admin.bookings')
  .use(middleware.auth({ guards: ['admin'] }))
