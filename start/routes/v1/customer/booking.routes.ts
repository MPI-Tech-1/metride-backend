const SubmitBookingReviewController = () =>
  import('#controllers/v1/customer/booking/submit_booking_review_controller')
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
    router.post('/bookings/:bookingIdentifier/checkout/card', [CheckoutBookingWithCardController])
    router.post('/bookings/:bookingIdentifier/reviews', [SubmitBookingReviewController])
    router.get('/bookings/:bookingIdentifier', [GetBookingController])
    router.post('/bookings', [CreateBookingController])
    router.get('/bookings', [FetchBookingsController])
  })
  .use(middleware.auth({ guards: ['customer'] }))
  .as('customer.bookings')
  .prefix('api/v1/customer')
