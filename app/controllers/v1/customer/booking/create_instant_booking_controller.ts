import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import BookingPaymentActions from '#model_management/actions/booking_payment_actions'
import CreateInstantBookingRequestValidator from '#validators/v1/customer/booking/create_instant_booking_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import DriverActions from '#model_management/actions/driver_actions'
import calculateDistanceBetween2Points from '#common/helper_functions/calculate_distance_between_2_points'
import logApplicationError from '#common/helper_functions/log_application_error'
import logBookingUpdatePayload from '#common/helper_functions/log_booking_update_payload'
import createBookingSlackEventPayload from '#common/helper_functions/create_booking_slack_event_payload'
import DriverVehicleActions from '#model_management/actions/driver_vehicle_actions'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'

export default class CreateInstantBookingController {
  async handle({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(CreateInstantBookingRequestValidator)

    const {
      driverIdentifier,
      departureLocationName,
      departureLocationGpsCoordinates,
      departureLocationType,
      destinationLocationName,
      destinationLocationGpsCoordinates,
      destinationLocationType,
      dateOfRide,
      paymentTiming,
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

    const driver = await DriverActions.getDriver({
      identifierType: 'identifier',
      identifier: driverIdentifier,
    })

    if (!driver) {
      return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
        status: ERROR,
        status_code: HttpStatusCodesEnum.NOT_FOUND,
        message: 'Driver not found.',
      })
    }

    const driverVehicle = await DriverVehicleActions.getDriverVehicle({
      identifierType: 'driverId',
      identifier: driver.id,
    })

    if (!driverVehicle) {
      return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
        status: ERROR,
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        message: 'The selected driver has no registered vehicle.',
      })
    }

    const dbTransaction = await db.transaction()

    try {
      const loggedInCustomer = auth.use('customer').user!

      const booking = await BookingActions.createBookingRecord({
        createPayload: {
          customerId: loggedInCustomer.id,
          assignedDriverId: driver.id,
          typeOfBooking: 'instant',
          status: 'assigned-a-driver',
          paymentTiming: paymentTiming ?? 'pay_now',
          departureLocationName,
          departureLocationGpsCoordinates,
          departureLocationType,
          destinationLocationName,
          destinationLocationGpsCoordinates,
          destinationLocationType,
          estimatedDistanceInMeters: distance.distanceInMeters,
          estimatedDurationInSeconds: distance.estimatedDurationInSeconds,
          rideTypeId: driverVehicle.rideTypeId,
          isRecurringBooking: false,
          dateOfRide,
          recurringBookingDates: {},
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await BookingPaymentActions.createBookingPaymentRecord({
        createPayload: {
          bookingId: booking.id,
          basePrice: distance.distanceInKilometers * driverVehicle.rideType.pricePerKilometer,
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
        status: finalBooking!.status,
        paymentTiming: finalBooking!.paymentTiming,
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
        dateOfRide: finalBooking!.dateOfRide,
        assignedDriver: {
          identifier: finalBooking!.assignedDriver.identifier,
          firstName: finalBooking!.assignedDriver.firstName,
          lastName: finalBooking!.assignedDriver.lastName,
          mobileNumber: finalBooking!.assignedDriver.mobileNumber,
        },
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
          summary: `A new instant booking has been created by ${finalBooking!.customer.firstName} ${finalBooking!.customer.lastName} and assigned to ${driver.firstName} ${driver.lastName}.`,
          metadata: { bookingChannel: 'customer_api' },
        })
      )

      // For pay-on-arrival rides there is no upfront payment to trigger the driver
      // assignment notification, so notify the assigned driver immediately at creation.
      if (finalBooking!.paymentTiming === 'pay_on_arrival') {
        await NotificationDispatchClient.sendBookingDriverAssignmentNotificationJob({
          bookingId: finalBooking!.id,
        })
      }

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Instant booking created successfully',
        results: responsePayload,
      })
    } catch (CreateInstantBookingControllerError) {
      await dbTransaction.rollback()
      console.log('CreateInstantBookingControllerError -> ', CreateInstantBookingControllerError)
      await logApplicationError(CreateInstantBookingControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
