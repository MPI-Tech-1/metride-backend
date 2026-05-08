import { isValidJson } from '#common/helper_functions/is_valid_json'
import { CACHE_DATA_DOES_NOT_EXIST } from '#common/messages/system_messages'
import BackgroundDispatchClient from '#infrastructure_providers/internals/background_dispatch_client'
import CacheClient from '#infrastructure_providers/internals/cache_client'
import { type LogBookingGpsCoordinatesBackgroundProcessingJobPayload } from '#jobs/background_processing/booking/log_booking_gps_coordinates_background_processing_job'
import BookingActions from '#model_management/actions/booking_actions'
import logApplicationError from '#common/helper_functions/log_application_error'
import type { Server, Socket } from 'socket.io'

export async function logBookingGpsCoordinatesSocketHandler(io: Server, socket: Socket) {
  socket.on('driver:location', async (data) => {
    try {
      console.log('New GPS Message from Driver App => ', data)

      const isJsonValid = isValidJson(data)

      if (isJsonValid === false) {
        return
      }

      let parsedData: LogBookingGpsCoordinatesBackgroundProcessingJobPayload = JSON.parse(data)

      const booking = await BookingActions.getBooking({
        identifierType: 'identifier',
        identifier: parsedData.bookingIdentifier,
      })

      if (!booking) {
        console.warn('[driver:location] Booking not found =>', parsedData.bookingIdentifier)
        return
      }

      // ✅ Guard against null relations
      if (!booking.assignedDriver || !booking.customer) {
        console.warn('[driver:location] Booking missing driver or customer =>', booking)
        return
      }

      const customerSocketId = await CacheClient.fetchData(
        `customer-websocket:${parsedData.bookingIdentifier}`
      )
      console.log('customerSocketId => ', customerSocketId)

      await BackgroundDispatchClient.logBookingGpsCoordinatesBackgroundProcessingJob(parsedData)

      const messageData = {
        identifier: parsedData.bookingIdentifier,
        driver: {
          identifier: booking.assignedDriver.identifier,
          fullName: booking.assignedDriver.fullName,
        },
        customer: {
          identifier: booking.customer.identifier,
          fullName: booking.customer.fullName,
        },
        gpsCoordinates: parsedData.gpsCoordinates,
      }

      if (customerSocketId !== CACHE_DATA_DOES_NOT_EXIST) {
        io.to(customerSocketId).emit('booking:driver-location', messageData)
      } else {
        console.log('[driver:location] No customer socket found =>', parsedData.bookingIdentifier)
      }

      io.to('room:admins').emit('booking:driver-location', messageData)
    } catch (error) {
      console.error('[driver:location] Unhandled error =>', error)
      await logApplicationError(error)
    }
  })
}
