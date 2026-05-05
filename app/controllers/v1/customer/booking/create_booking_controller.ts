import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import BookingPaymentActions from '#model_management/actions/booking_payment_actions'
import CreateBookingRequestValidator from '#validators/v1/customer/booking/create_booking_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import RideTypeActions from '#model_management/actions/ride_type_actions'
import calculateDistanceBetween2Points from '#common/helper_functions/calculate_distance_between_2_points'

export default class CreateBookingController {
  async handle({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(CreateBookingRequestValidator)

    const {
      typeOfBooking,
      departureLocationName,
      departureLocationGpsCoordinates,
      departureLocationType,
      destinationLocationName,
      destinationLocationGpsCoordinates,
      destinationLocationType,
      rideTypeIdentifier,
      isRecurringBooking,
      dateOfRide,
      recurringBookingDates,
    } = payload

    const { mutatedPayload: distance } = await calculateDistanceBetween2Points(
      departureLocationGpsCoordinates,
      destinationLocationGpsCoordinates
    )

    if (!distance) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status: ERROR,
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        message: 'Unable to calculate distance between locations',
      })
    }

    const dbTransaction = await db.transaction()

    try {
      const loggedInCustomer = auth.use('customer').user!

      const rideType = await RideTypeActions.getRideType({
        identifierType: 'identifier',
        identifier: rideTypeIdentifier,
      })

      const booking = await BookingActions.createBookingRecord({
        createPayload: {
          customerId: loggedInCustomer.id,
          typeOfBooking: typeOfBooking,
          departureLocationName: departureLocationName,
          departureLocationGpsCoordinates: departureLocationGpsCoordinates,
          departureLocationType: departureLocationType,
          destinationLocationName: destinationLocationName,
          destinationLocationGpsCoordinates: destinationLocationGpsCoordinates,
          destinationLocationType: destinationLocationType,
          estimatedDistanceInMeters: distance.distanceInMeters,
          estimatedDurationInSeconds: distance.estimatedDurationInSeconds,
          rideTypeId: rideType?.id,
          isRecurringBooking: isRecurringBooking || false,
          dateOfRide: dateOfRide,
          recurringBookingDates: recurringBookingDates || {},
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await BookingPaymentActions.createBookingPaymentRecord({
        createPayload: {
          bookingId: booking.id,
          basePrice: distance.distanceInKilometers * rideType!.pricePerKilometer,
          discountAmount: 0,
          amountPaid: 0,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await dbTransaction.commit()

      const finalBooking = await BookingActions.getBooking({
        identifierType: 'id',
        identifier: booking.id,
      })

      const responsePayload = {
        identifier: finalBooking!.identifier,
        typeOfBooking: finalBooking!.typeOfBooking,
        departureLocationName: finalBooking!.departureLocationName,
        departureLocationGpsCoordinates: finalBooking!.departureLocationGpsCoordinates,
        departureLocationType: finalBooking!.departureLocationType,
        destinationLocationName: finalBooking!.destinationLocationName,
        destinationLocationGpsCoordinates: finalBooking!.destinationLocationGpsCoordinates,
        destinationLocationType: finalBooking!.destinationLocationType,
        rideType: {
          identifier: finalBooking!.rideType.identifier,
          name: finalBooking!.rideType.name,
        },
        estimatedDurationInSeconds: finalBooking!.estimatedDurationInSeconds,
        estimatedDistanceInMeters: finalBooking!.estimatedDistanceInMeters,
        isRecurringBooking: finalBooking!.isRecurringBooking,
        dateOfRide: finalBooking!.dateOfRide,
        recurringBookingDates: finalBooking!.recurringBookingDates,
        bookingPayment: {
          identifier: finalBooking!.bookingPayment.identifier,
          basePrice: finalBooking!.bookingPayment.basePrice,
          discountAmount: finalBooking!.bookingPayment.discountAmount,
          amountPaid: finalBooking!.bookingPayment.amountPaid,
        },
      }

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Booking created successfully',
        results: responsePayload,
      })
    } catch (CreateBookingControllerError) {
      await dbTransaction.rollback()
      console.log('CreateBookingControllerError -> ', CreateBookingControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
