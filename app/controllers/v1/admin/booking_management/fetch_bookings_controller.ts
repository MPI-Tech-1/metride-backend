import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import ListBookingsRequestValidator from '#validators/v1/admin/booking_management/list_bookings_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import CustomerActions from '#model_management/actions/customer_actions'
import DriverActions from '#model_management/actions/driver_actions'

export default class FetchBookingsController {
  async handle({ request, response }: HttpContext) {
    const {
      page = 1,
      limit = 10,
      searchQuery,
      customerIdentifier,
      assignedDriverIdentifier,
      typeOfBooking,
      isRecurringBooking,
    } = await request.validateUsing(ListBookingsRequestValidator)

    const customer = await CustomerActions.getCustomer({
      identifierType: 'identifier',
      identifier: customerIdentifier ?? '',
    })

    const assignedDriver = await DriverActions.getDriver({
      identifierType: 'identifier',
      identifier: assignedDriverIdentifier ?? '',
    })
    try {
      const { bookingPayload: bookings, paginationMeta } = await BookingActions.listBookings({
        filterRecordOptionsPayload: {
          searchQuery,
          customerId: customer?.id,
          assignedDriverId: assignedDriver?.id,
          typeOfBooking,
          isRecurringBooking,
        },
        paginationPayload: {
          page,
          limit,
        },
      })

      const mutatedResponsePayload = bookings.map((booking) => ({
        identifier: booking.identifier,
        typeOfBooking: booking.typeOfBooking,
        status: booking.status,
        tripProgress: booking.tripProgress,
        isRecurringBooking: booking.isRecurringBooking,
        dateOfRide: booking.dateOfRide,
        recurringBookingDates: booking.recurringBookingDates,
        estimatedDurationInSeconds: booking.estimatedDurationInSeconds,
        estimatedDistanceInMeters: booking.estimatedDistanceInMeters,
        rideType: {
          identifier: booking.rideType.identifier,
          name: booking.rideType.name,
          numberOfSeats: booking.rideType.numberOfSeats,
          pricePerKilometer: booking.rideType.pricePerKilometer,
          minimumPrice: booking.rideType.minimumPrice,
        },
        bookingPayment: {
          identifier: booking.bookingPayment.identifier,
          paymentMethod: booking.bookingPayment.paymentMethod,
          basePrice: booking.bookingPayment.basePrice,
          paymentStatus: booking.bookingPayment.paymentStatus,
        },
        departureLocation: {
          name: booking.departureLocationName,
          gpsCoordinates: booking.departureLocationGpsCoordinates,
          type: booking.departureLocationType,
        },
        customer: booking.customer
          ? {
              identifier: booking.customer?.identifier,
              firstName: booking.customer?.firstName,
              lastName: booking.customer?.lastName,
              email: booking.customer?.email,
            }
          : null,
        assignedDriver: booking.assignedDriver
          ? {
              identifier: booking.assignedDriver?.identifier,
              firstName: booking.assignedDriver?.firstName,
              lastName: booking.assignedDriver?.lastName,
              email: booking.assignedDriver?.email,
            }
          : null,
        destinationLocation: {
          name: booking.destinationLocationName,
          gpsCoordinates: booking.destinationLocationGpsCoordinates,
          type: booking.destinationLocationType,
        },
        createdAt: booking.createdAt,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Bookings fetched successfully.',
        results: {
          bookings: mutatedResponsePayload,
          paginationMeta,
        },
      })
    } catch (FetchBookingsControllerError) {
      console.log('FetchBookingsControllerError -> ', FetchBookingsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
