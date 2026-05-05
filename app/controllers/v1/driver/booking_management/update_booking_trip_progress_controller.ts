import { type HttpContext } from '@adonisjs/core/http'
import BookingActions from '#model_management/actions/booking_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import UpdateBookingTripProgressRequestValidator from '#validators/v1/driver/booking_management/update_booking_trip_progress_request_validator'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import BackgroundDispatchClient from '#infrastructure_providers/internals/background_dispatch_client'

export default class UpdateBookingTripProgress {
  async handle({ auth, request, response }: HttpContext) {
    const { identifier } = request.params()

    const { tripProgress } = await request.validateUsing(UpdateBookingTripProgressRequestValidator)

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

      const loggedInDriver = auth.use('driver').user!

      if (booking.assignedDriverId !== loggedInDriver.id) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'This booking is not assigned to you',
        })
      }

      if (booking.status !== 'accepted') {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Booking must be accepted before updating trip progress',
        })
      }

      await BookingActions.updateBookingRecord({
        identifierOptions: {
          identifierType: 'identifier',
          identifier,
        },
        updatePayload: {
          tripProgress,
          status: tripProgress === 'completed' ? 'completed' : undefined,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      await NotificationDispatchClient.sendBookingTripProgressNotificationJob({
        bookingId: booking.id,
      })

      if (tripProgress === 'completed') {
        await BackgroundDispatchClient.processDriverWalletEarningJob({
          bookingId: booking.id,
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver updated the booking trip progress successfully.',
      })
    } catch (UpdateBookingTripProgressError) {
      console.log('UpdateBookingTripProgressError -> ', UpdateBookingTripProgressError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
