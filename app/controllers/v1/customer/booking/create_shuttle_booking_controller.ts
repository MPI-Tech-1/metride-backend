import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import BookingPaymentActions from '#model_management/actions/booking_payment_actions'
import CreateShuttleBookingRequestValidator from '#validators/v1/customer/booking/create_shuttle_booking_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import RideTypeActions from '#model_management/actions/ride_type_actions'
import calculateDistanceBetween2Points from '#common/helper_functions/calculate_distance_between_2_points'
import logApplicationError from '#common/helper_functions/log_application_error'
import logBookingUpdatePayload from '#common/helper_functions/log_booking_update_payload'
import createBookingSlackEventPayload from '#common/helper_functions/create_booking_slack_event_payload'

export default class CreateShuttleBookingController {
  async handle({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(CreateShuttleBookingRequestValidator)

    const {
      departureLocationName,
      departureLocationGpsCoordinates,
      departureLocationType,
      destinationLocationName,
      destinationLocationGpsCoordinates,
      destinationLocationType,
      rideTypeIdentifier,
      isRecurringBooking,
      dateOfRide,
      timeOfRide,
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
          typeOfBooking: 'shuttle',
          departureLocationName,
          departureLocationGpsCoordinates,
          departureLocationType,
          destinationLocationName,
          destinationLocationGpsCoordinates,
          destinationLocationType,
          estimatedDistanceInMeters: distance.distanceInMeters,
          estimatedDurationInSeconds: distance.estimatedDurationInSeconds,
          rideTypeId: rideType?.id,
          isRecurringBooking: isRecurringBooking || false,
          dateOfRide,
          timeOfRide: timeOfRide ?? null,
          recurringBookingDates: recurringBookingDates || {},
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      const numberOfRideDays = isRecurringBooking
        ? recurringBookingDates!.days.length * recurringBookingDates!.durationInWeeks
        : 1

      await BookingPaymentActions.createBookingPaymentRecord({
        createPayload: {
          bookingId: booking.id,
          basePrice: distance.distanceInKilometers * rideType!.pricePerKilometer * numberOfRideDays,
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
        timeOfRide: finalBooking!.timeOfRide,
        recurringBookingDates: finalBooking!.recurringBookingDates,
        bookingPayment: {
          identifier: finalBooking!.bookingPayment.identifier,
          basePrice: finalBooking!.bookingPayment.basePrice,
          discountAmount: finalBooking!.bookingPayment.discountAmount,
          amountPaid: finalBooking!.bookingPayment.amountPaid,
        },
      }

      await logBookingUpdatePayload(
        createBookingSlackEventPayload({
          eventType: 'booking_created',
          booking: finalBooking!,
          summary: `A new shuttle booking has been created by ${finalBooking!.customer.firstName} ${finalBooking!.customer.lastName}.`,
          metadata: { bookingChannel: 'customer_api' },
        })
      )

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Shuttle booking created successfully',
        results: responsePayload,
      })
    } catch (CreateShuttleBookingControllerError) {
      await dbTransaction.rollback()
      console.log('CreateShuttleBookingControllerError -> ', CreateShuttleBookingControllerError)
      await logApplicationError(CreateShuttleBookingControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
