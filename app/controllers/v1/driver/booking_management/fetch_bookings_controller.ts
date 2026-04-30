import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import FetchBookingsRequestValidator from '#validators/v1/driver/booking_management/fetch_bookings_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchBookingsController {
  async handle({ request, auth, response }: HttpContext) {
    const {
      page = 1,
      limit = 10,
      status,
    } = await request.validateUsing(FetchBookingsRequestValidator)

    try {
      const loggedInDriverId = auth.use('driver').user!
      const { bookingPayload: bookings, paginationMeta } = await BookingActions.listBookings({
        filterRecordOptionsPayload: {
          assignedDriverId: loggedInDriverId.id,
          status,
        },
        paginationPayload: {
          page,
          limit,
        },
      })

      const mutatedResponsePayload = bookings.map((booking) => ({
        identifier: booking.identifier,
        customer: {
          identifier: booking.customer.identifier,
          firstName: booking.customer.firstName,
          lastName: booking.customer.lastName,
          email: booking.customer.email,
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
          destinationLocation: {
            name: booking.destinationLocationName,
            gpsCoordinates: booking.destinationLocationGpsCoordinates,
            type: booking.destinationLocationType,
          },
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
