import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class GetBookingController {
  async handle({ params, response, auth }: HttpContext) {
    const { bookingIdentifier } = params

    try {
      const loggedInCustomer = auth.use('customer').user!

      const booking = await BookingActions.getBooking({
        identifierType: 'identifier',
        identifier: bookingIdentifier,
      })

      if (!booking || booking.customerId !== loggedInCustomer.id) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Booking not found.',
        })
      }

      const responsePayload = {
        identifier: booking.identifier,
        typeOfBooking: booking.typeOfBooking,
        departureLocationName: booking.departureLocationName,
        departureLocationGpsCoordinates: booking.departureLocationGpsCoordinates,
        departureLocationType: booking.departureLocationType,
        destinationLocationName: booking.destinationLocationName,
        destinationLocationGpsCoordinates: booking.destinationLocationGpsCoordinates,
        destinationLocationType: booking.destinationLocationType,
        rideType: {
          identifier: booking.rideType.identifier,
          name: booking.rideType.name,
          description: booking.rideType.description,
          numberOfSeats: booking.rideType.numberOfSeats,
          pricePerKilometer: booking.rideType.pricePerKilometer,
          basePrice: booking.rideType.basePrice,
          minimumPrice: booking.rideType.minimumPrice,
        },
        isRecurringBooking: booking.isRecurringBooking,
        dateOfRide: booking.dateOfRide,
        recurringBookingDates: booking.recurringBookingDates,
        bookingPayment: {
          identifier: booking.bookingPayment.identifier,
          basePrice: booking.bookingPayment.basePrice,
          discountAmount: booking.bookingPayment.discountAmount,
          amountPaid: booking.bookingPayment.amountPaid,
        },
        createdAt: booking.createdAt,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Booking fetched successfully.',
        results: responsePayload,
      })
    } catch (GetBookingControllerError) {
      console.log('GetBookingControllerError -> ', GetBookingControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
