import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import DriverActions from '#model_management/actions/driver_actions'
import AssignBookingDriverRequestValidator from '#validators/v1/admin/booking_management/assign_booking_driver_request_validator'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class AssignBookingDriverController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()
    const { driverIdentifier } = await request.validateUsing(AssignBookingDriverRequestValidator)

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

      if (booking.typeOfBooking !== 'shuttle') {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Only shuttle bookings can be assigned to a driver.',
        })
      }

      if (booking.bookingPayment.paymentStatus !== 'completed') {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Only completed payments can be assigned to a booking.',
        })
      }

      const driver = await DriverActions.getDriver({
        identifierType: 'identifier',
        identifier: driverIdentifier,
      })

      if (!driver) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Driver not found.',
        })
      }

      if (driver.status !== 'approved') {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Only approved drivers can be assigned to a booking.',
        })
      }

      await BookingActions.updateBookingRecord({
        identifierOptions: {
          identifierType: 'identifier',
          identifier,
        },
        updatePayload: {
          assignedDriverId: driver.id,
          status: 'assigned-a-driver',
        },
        dbTransactionOptions: { useTransaction: false },
      })

      await NotificationDispatchClient.sendBookingDriverAssignmentNotificationJob({
        bookingId: booking.id,
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver assigned to booking successfully.',
      })
    } catch (AssignBookingDriverControllerError) {
      console.log('AssignBookingDriverControllerError -> ', AssignBookingDriverControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
