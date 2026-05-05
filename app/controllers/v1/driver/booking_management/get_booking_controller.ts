import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class GetBookingController {
  async handle({ params, response }: HttpContext) {
    const { identifier } = params

    try {
      const booking = await BookingActions.getBooking({
        identifierType: 'identifier',
        identifier,
      })

      if (!booking) {
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
        estimatedDurationInSeconds: booking.estimatedDurationInSeconds,
        estimatedDistanceInMeters: booking.estimatedDistanceInMeters,
        destinationLocationType: booking.destinationLocationType,
        tripProgress: booking.tripProgress,
        status: booking.status,
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
        assignedDriver: booking.assignedDriver
          ? {
              identifier: booking.assignedDriver?.identifier,
              firstName: booking.assignedDriver?.firstName,
              lastName: booking.assignedDriver?.lastName,
              email: booking.assignedDriver?.email,
            }
          : null,
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
