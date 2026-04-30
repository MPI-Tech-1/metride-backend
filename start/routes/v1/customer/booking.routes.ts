import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const CreateBookingController = () =>
  import('#controllers/v1/customer/booking/create_booking_controller')
const CheckoutBookingWithCardController = () =>
  import('#controllers/v1/customer/booking/checkout_booking_with_card_controller')
const FetchBookingsController = () =>
  import('#controllers/v1/customer/booking/fetch_bookings_controller')
const GetBookingController = () => import('#controllers/v1/customer/booking/get_booking_controller')

router
  .group(() => {
    router.post('/bookings', [CreateBookingController])
    router.get('/bookings', [FetchBookingsController])
    router.get('/bookings/:bookingIdentifier', [GetBookingController])
    router.post('/bookings/:bookingIdentifier/checkout/card', [CheckoutBookingWithCardController])
  })
  .use(middleware.auth({ guards: ['customer'] }))
  .prefix('api/v1/customer')
