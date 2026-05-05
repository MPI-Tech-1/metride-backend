import BackgroundDispatchClient from '#infrastructure_providers/internals/background_dispatch_client'
import BookingActions from '#model_management/actions/booking_actions'

export default async function enqueueProcessDriverBookingEarningsCronjob() {
  const { bookingPayload: uncreditedBookings } =
    await BookingActions.listBookingsWithUncreditedDriverEarnings()
  const uncreditedBookingsPromise = uncreditedBookings.map(async (booking) => {
    await BackgroundDispatchClient.processDriverWalletEarningJob({ bookingId: booking.id })
  })

  await Promise.all(uncreditedBookingsPromise)
}
