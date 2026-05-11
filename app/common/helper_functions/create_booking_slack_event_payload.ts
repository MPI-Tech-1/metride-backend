import type Booking from '#models/booking'

export type BookingSlackEventType =
  | 'booking_created'
  | 'driver_assigned'
  | 'driver_accepted'
  | 'driver_cancelled'
  | 'booking_rejected'
  | 'trip_progress_updated'
  | 'payment_failed'
  | 'payment_completed'
  | 'booking_completed'

interface CreateBookingSlackEventPayloadOptions {
  eventType: BookingSlackEventType
  booking: Booking
  summary: string
  metadata?: Record<string, unknown>
}

const bookingEventTitleMap: Record<BookingSlackEventType, string> = {
  booking_created: 'Booking Created',
  driver_assigned: 'Driver Assigned',
  driver_accepted: 'Driver Accepted',
  driver_cancelled: 'Driver Cancelled',
  booking_rejected: 'Booking Rejected',
  trip_progress_updated: 'Trip Progress Updated',
  payment_failed: 'Payment Failed',
  payment_completed: 'Payment Completed',
  booking_completed: 'Booking Completed',
}

export default function createBookingSlackEventPayload(
  createBookingSlackEventPayloadOptions: CreateBookingSlackEventPayloadOptions
): Record<string, unknown> {
  const { eventType, booking, summary, metadata } = createBookingSlackEventPayloadOptions

  return {
    eventType,
    eventTitle: bookingEventTitleMap[eventType],
    summary,
    booking: {
      identifier: booking.identifier,
      status: booking.status,
      tripProgress: booking.tripProgress,
      typeOfBooking: booking.typeOfBooking,
      departureLocationName: booking.departureLocationName,
      destinationLocationName: booking.destinationLocationName,
      estimatedDistanceInMeters: booking.estimatedDistanceInMeters,
      estimatedDurationInSeconds: booking.estimatedDurationInSeconds,
      dateOfRide: booking.dateOfRide?.toISO?.() ?? null,
      isRecurringBooking: booking.isRecurringBooking,
      rideTypeName: booking.rideType?.name,
    },
    customer: {
      name: booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}` : null,
      phoneNumber: booking.customer?.mobileNumber ?? null,
      email: booking.customer?.email ?? null,
    },
    driver: booking.assignedDriverId
      ? {
          name: booking.assignedDriver
            ? `${booking.assignedDriver.firstName} ${booking.assignedDriver.lastName}`
            : null,
          phoneNumber: booking.assignedDriver?.mobileNumber ?? null,
          email: booking.assignedDriver?.email ?? null,
        }
      : null,
    payment: booking.bookingPayment
      ? {
          paymentStatus: booking.bookingPayment.paymentStatus,
          paymentMethod: booking.bookingPayment.paymentMethod ?? null,
          basePrice: booking.bookingPayment.basePrice,
          discountAmount: booking.bookingPayment.discountAmount,
          amountPaid: booking.bookingPayment.amountPaid,
        }
      : null,
    metadata: metadata ?? {},
  }
}
