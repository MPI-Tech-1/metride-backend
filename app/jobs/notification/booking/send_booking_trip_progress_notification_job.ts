import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import BookingActions from '#model_management/actions/booking_actions'
import CustomerNotificationActions from '#model_management/actions/customer_notification_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'

export interface SendBookingTripProgressNotificationJobPayload {
  bookingId: number
}

const tripProgressMessageMap: Record<string, string> = {
  'heading-to-pickup': 'Your driver is heading to your pickup location.',
  'arrived-at-pickup': 'Your driver has arrived at your pickup location.',
  'enroute-to-dropoff': 'Your trip is underway. You are on your way to your destination.',
  'completed': 'Your trip has been completed. Thank you for riding with us.',
}

const tripProgressTitleMap: Record<string, string> = {
  'heading-to-pickup': 'Driver On The Way',
  'arrived-at-pickup': 'Driver Arrived',
  'enroute-to-dropoff': 'Trip In Progress',
  'completed': 'Trip Completed',
}

export default class SendBookingTripProgressNotificationJob extends Job<SendBookingTripProgressNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendBookingTripProgressNotificationJob', this.payload)
    const { bookingId } = this.payload

    const booking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!booking) {
      throw new Error('SendBookingTripProgressNotificationJob: booking not found')
    }

    const notificationContent = tripProgressMessageMap[booking.tripProgress]
    const notificationTitle = tripProgressTitleMap[booking.tripProgress]

    if (!notificationContent) {
      return
    }

    const dbTransaction = await db.transaction()

    try {
      const customerNotification =
        await CustomerNotificationActions.createCustomerNotificationRecord({
          createPayload: {
            customerId: booking.customerId,
            content: notificationContent,
            isNotificationRead: false,
            payload: {
              identifier: booking.identifier,
              tripProgress: booking.tripProgress,
            },
            notificationType: 'bookings:trip_progress',
          },
          dbTransactionOptions: { dbTransaction, useTransaction: true },
        })

      await dbTransaction.commit()

      if (booking.customer.fcmToken) {
        const pushNotificationProvider = configurePushNotificationProvider()

        await pushNotificationProvider.send({
          token: booking.customer.fcmToken!,
          notification: {
            title: notificationTitle,
            body: customerNotification.content,
          },
          data: {
            identifier: customerNotification.identifier,
            content: customerNotification.content,
            tripProgress: booking.tripProgress,
          },
        })
      }
    } catch (sendBookingTripProgressNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendBookingTripProgressNotificationJobError => ',
        sendBookingTripProgressNotificationJobError
      )
    }
  }

  async failed(error: Error) {
    console.error('SendBookingTripProgressNotificationJob failed:', error.message)
  }
}
