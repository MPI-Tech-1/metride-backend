import { CACHE_DATA_DOES_NOT_EXIST } from '#common/messages/system_messages'
import BackgroundDispatchClient from '#infrastructure_providers/internals/background_dispatch_client'
import CacheClient from '#infrastructure_providers/internals/cache_client'
import { type LogBookingGpsCoordinatesBackgroundProcessingJobPayload } from '#jobs/background_processing/booking/log_booking_gps_coordinates_background_processing_job'
import type { Server, Socket } from 'socket.io'

export async function logBookingGpsCoordinatesSocketHandler(io: Server, socket: Socket) {
  socket.on('driver:location', async (data) => {
    console.log('New GPS Message from Driver App => ', data)

    const parsedData: LogBookingGpsCoordinatesBackgroundProcessingJobPayload = JSON.parse(data)

    const customerSocketId = await CacheClient.fetchData(
      `customer-websocket:${parsedData.bookingIdentifier}`
    )

    console.log('customerSocketId => ', customerSocketId)

    await BackgroundDispatchClient.logBookingGpsCoordinatesBackgroundProcessingJob(parsedData)

    if (customerSocketId !== CACHE_DATA_DOES_NOT_EXIST) {
      io.to(customerSocketId).emit('booking:driver-location', data)
    } else {
      console.log('No customer socket found for bookingId => ', parsedData.bookingIdentifier)
    }
  })
}
