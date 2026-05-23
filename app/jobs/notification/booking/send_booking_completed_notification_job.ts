import {
  BOOKING_COMPLETED_EMAIL_SUBJECT,
  BOOKING_COMPLETED_EMAIL_TEMPLATE,
} from '#common/messages/email_types'
import formatKoboToNairaDisplay from '#common/helper_functions/format_kobo_to_naira_display'
import configurePushNotificationProvider from '#infrastructure_providers/helpers/configure_push_notification_provider'
import MailClient from '#infrastructure_providers/internals/mail_client'
import BookingActions from '#model_management/actions/booking_actions'
import CustomerNotificationActions from '#model_management/actions/customer_notification_actions'
import DriverNotificationActions from '#model_management/actions/driver_notification_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { DateTime } from 'luxon'
import logApplicationError from '#common/helper_functions/log_application_error'

export interface SendBookingCompletedNotificationJobPayload {
  bookingId: number
}

function formatTripDuration(estimatedDurationInSeconds: number): string {
  if (!estimatedDurationInSeconds || estimatedDurationInSeconds < 0) {
    return 'N/A'
  }
  const minutes = Math.round(estimatedDurationInSeconds / 60)
  if (minutes < 60) {
    return `${minutes} min`
  }
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`
}

function formatDistance(estimatedDistanceInMeters: number): string {
  if (!estimatedDistanceInMeters || estimatedDistanceInMeters < 0) {
    return 'N/A'
  }
  const km = estimatedDistanceInMeters / 1000
  return `${km.toFixed(km < 10 ? 1 : 0)} km`
}

export default class SendBookingCompletedNotificationJob extends Job<SendBookingCompletedNotificationJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing SendBookingCompletedNotificationJob', this.payload)
    const { bookingId } = this.payload

    const booking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!booking) {
      throw new Error('SendBookingCompletedNotificationJob: booking not found')
    }

    const dbTransaction = await db.transaction()

    const notificationType = 'bookings:booking_completed'

    try {
      if (booking.assignedDriverId) {
        await DriverNotificationActions.createDriverNotificationRecord({
          createPayload: {
            driverId: booking.assignedDriverId,
            content: 'A booking you were assigned to has been completed.',
            isNotificationRead: false,
            payload: {
              identifier: booking.identifier,
            },
            notificationType,
          },
          dbTransactionOptions: { dbTransaction, useTransaction: true },
        })
      }

      const customerNotification =
        await CustomerNotificationActions.createCustomerNotificationRecord({
          createPayload: {
            customerId: booking.customerId,
            content: 'Your booking has been completed. Thank you for riding with us!',
            isNotificationRead: false,
            payload: {
              identifier: booking.identifier,
            },
            notificationType,
          },
          dbTransactionOptions: { dbTransaction, useTransaction: true },
        })

      await dbTransaction.commit()

      const pushNotificationProvider = configurePushNotificationProvider()

      if (booking.assignedDriver?.fcmToken) {
        await pushNotificationProvider.send({
          token: booking.assignedDriver.fcmToken,
          notification: {
            title: 'Booking Completed',
            body: 'A booking you were assigned to has been completed.',
          },
          data: {},
        })
      }

      if (booking.customer.fcmToken) {
        await pushNotificationProvider.send({
          token: booking.customer.fcmToken,
          notification: {
            title: 'Booking Completed',
            body: customerNotification.content,
          },
          data: {},
        })
      }

      const payment = booking.bookingPayment
      const driver = booking.assignedDriver

      await MailClient.sendMail({
        recipientEmail: booking.customer.email,
        recipientName: `${booking.customer.firstName} ${booking.customer.lastName}`,
        emailSubject: BOOKING_COMPLETED_EMAIL_SUBJECT,
        emailTemplate: BOOKING_COMPLETED_EMAIL_TEMPLATE,
        emailPayload: {
          recipientFirstName: booking.customer.firstName,
          bookingReference: booking.identifier,
          tripDate: booking.dateOfRide
            ? booking.dateOfRide.setZone('Africa/Lagos').toFormat("ccc, d LLL yyyy '·' h:mm a")
            : 'N/A',
          receiptIssuedAt: DateTime.now()
            .setZone('Africa/Lagos')
            .toFormat("d LLL yyyy 'at' h:mm a"),
          typeOfBooking: booking.typeOfBooking,
          rideTypeName: booking.rideType?.name ?? 'N/A',
          departureLocationName: booking.departureLocationName,
          destinationLocationName: booking.destinationLocationName,
          estimatedDistance: formatDistance(booking.estimatedDistanceInMeters),
          estimatedDuration: formatTripDuration(booking.estimatedDurationInSeconds),
          driverName: driver ? `${driver.firstName} ${driver.lastName}` : null,
          paymentMethod: payment.paymentMethod,
          paymentStatus: payment.paymentStatus,
          basePriceFormatted: formatKoboToNairaDisplay(payment.basePrice),
          discountFormatted: formatKoboToNairaDisplay(payment.discountAmount),
          amountPaidFormatted: formatKoboToNairaDisplay(payment.amountPaid),
        },
      })
    } catch (sendBookingCompletedNotificationJobError) {
      await dbTransaction.rollback()
      console.log(
        'sendBookingCompletedNotificationJobError => ',
        sendBookingCompletedNotificationJobError
      )
      await logApplicationError(sendBookingCompletedNotificationJobError)
    }
  }

  async failed(error: Error) {
    console.error('SendBookingCompletedNotificationJob failed:', error.message)
    await logApplicationError(error)
  }
}
