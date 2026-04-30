import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'

export default class RejectBookingController {
  async handle({ auth, request, response }: HttpContext) {
    const { identifier } = request.params()

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

      if (['created', 'pending', 'rejected', 'completed'].includes(booking.status)) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Only assigned bookings can be rejected.',
        })
      }

      const loggedInDriver = auth.use('driver').user!

      if (booking.assignedDriverId !== loggedInDriver.id) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'This booking is not assigned to you.',
        })
      }

      await BookingActions.updateBookingRecord({
        identifierOptions: {
          identifierType: 'identifier',
          identifier,
        },
        updatePayload: {
          status: 'rejected',
        },
        dbTransactionOptions: { useTransaction: false },
      })

      await NotificationDispatchClient.sendBookingRejectedNotificationJob({
        bookingId: booking.id,
      })
      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver rejected the booking successfully.',
      })
    } catch (RejectBookingControllerError) {
      console.log('RejectBookingControllerError -> ', RejectBookingControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
