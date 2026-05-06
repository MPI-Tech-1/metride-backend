import BookingActions from '#model_management/actions/booking_actions'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import BookingGpsLogActions from '#model_management/actions/booking_gps_log_actions'

export interface LogBookingGpsCoordinatesBackgroundProcessingJobPayload {
  bookingIdentifier: string

  gpsCoordinates: string
}

export default class LogBookingGpsCoordinatesBackgroundProcessingJob extends Job<LogBookingGpsCoordinatesBackgroundProcessingJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('LogBookingGpsCoordinatesBackgroundProcessingJob', this.payload)

    const { bookingIdentifier, gpsCoordinates } = this.payload

    const booking = await BookingActions.getBooking({
      identifierType: 'identifier',
      identifier: bookingIdentifier,
    })

    if (!booking) {
      throw new Error(
        `LogBookingGpsCoordinatesBackgroundProcessingJob: booking not found for identifier ${bookingIdentifier}`
      )
    }

    if (booking.tripProgress === 'not-started') {
      throw new Error(
        `LogBookingGpsCoordinatesBackgroundProcessingJob: booking trip progress is not started for booking ${bookingIdentifier}`
      )
    }

    await BookingGpsLogActions.createBookingGpsLogRecord({
      createPayload: {
        bookingId: booking.id,
        customerId: booking.customerId,
        driverId: booking.assignedDriverId!,
        gpsCoordinates,
      },
      dbTransactionOptions: {
        useTransaction: false,
      },
    })
  }

  async failed(error: Error) {
    console.error('LogBookingGpsCoordinatesBackgroundProcessingJob failed:', error.message)
  }
}
