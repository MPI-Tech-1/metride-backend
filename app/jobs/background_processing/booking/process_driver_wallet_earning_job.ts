import BookingActions from '#model_management/actions/booking_actions'
import DriverWalletActions from '#model_management/actions/driver_wallet_actions'
import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { randomUUID } from 'node:crypto'
import logApplicationError from '#common/helper_functions/log_application_error'
import DriverSettingActions from '#model_management/actions/driver_setting_actions'
import Booking from '#models/booking'
import MvestVehicleAgreement from '#models/mvest_vehicle_agreement'
import MvestEarning from '#models/mvest_earning'
import { DateTime } from 'luxon'

export interface ProcessDriverWalletEarningJobPayload {
  bookingId: number
}

export default class ProcessDriverWalletEarningJob extends Job<ProcessDriverWalletEarningJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    console.log('Processing ProcessDriverWalletEarningJob', this.payload)
    const { bookingId } = this.payload

    const initialBooking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!initialBooking) {
      throw new Error('ProcessDriverWalletEarningJob: booking not found')
    }

    if (initialBooking.status !== 'completed') {
      throw new Error('ProcessDriverWalletEarningJob: booking has not been completed')
    }

    if (!initialBooking.assignedDriverId) {
      throw new Error('ProcessDriverWalletEarningJob: booking has no assigned driver')
    }
    const assignedDriverId = initialBooking.assignedDriverId

    const dbTransaction = await db.transaction()

    try {
      const booking = await Booking.query({ client: dbTransaction })
        .preload('bookingPayment')
        .where('id', bookingId)
        .forUpdate()
        .firstOrFail()

      if (booking.hasEarningBeenCreditedToDriver === true) {
        await dbTransaction.commit()
        return
      }

      const wallet = await DriverWalletActions.getDriverWallet({
        identifierType: 'driverId',
        identifier: assignedDriverId,
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
      })

      if (!wallet) {
        throw new Error('ProcessDriverWalletEarningJob: driver wallet not found')
      }

      const driverSettings = await DriverSettingActions.getDriverSetting({
        identifierType: 'driverId',
        identifier: assignedDriverId,
      })

      if (!driverSettings) {
        throw new Error('ProcessDriverWalletEarningJob: Driver does not have a settings')
      }

      const paidAmount = booking.bookingPayment.amountPaid
      const commisionInPercentage = driverSettings.commissionPercentage / 100

      const earningAmount = Math.floor(paidAmount * commisionInPercentage)

      await DriverWalletTransactionActions.createDriverWalletTransactionRecord({
        createPayload: {
          driverId: wallet.driverId,
          driverWalletId: wallet.id,
          amount: earningAmount,
          systemGeneratedTransactionReference: randomUUID(),
          providerTransactionReference: null,
          remark: `Earning from booking ${booking.identifier}`,
          typeOfTransaction: 'credit',
          status: 'completed',
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverWalletActions.updateDriverWalletRecord({
        identifierOptions: { identifierType: 'id', identifier: wallet.id },
        updatePayload: {
          balance: wallet.balance + earningAmount,
          totalInflowFunds: wallet.totalInflowFunds + earningAmount,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      if (booking.driverVehicleId) {
        const now = DateTime.now()
        const agreement = await MvestVehicleAgreement.query({ client: dbTransaction })
          .where('driver_vehicle_id', booking.driverVehicleId)
          .where('is_active', true)
          .where('starts_at', '<=', now.toSQL()!)
          .where((query) => query.whereNull('ends_at').orWhere('ends_at', '>=', now.toSQL()!))
          .first()

        if (agreement) {
          const existingMvestEarning = await MvestEarning.query({ client: dbTransaction })
            .where('booking_id', booking.id)
            .first()
          if (!existingMvestEarning) {
            const eligibleAmount = booking.bookingPayment.basePrice
            const mvestEarning = new MvestEarning()
            mvestEarning.useTransaction(dbTransaction)
            mvestEarning.merge({
              bookingId: booking.id,
              mvestOwnerId: agreement.mvestOwnerId,
              mvestVehicleAgreementId: agreement.id,
              driverVehicleId: booking.driverVehicleId,
              eligibleAmount,
              commissionPercentage: agreement.commissionPercentage,
              commissionAmount: Math.floor((eligibleAmount * agreement.commissionPercentage) / 100),
              status: 'pending',
            })
            await mvestEarning.save()
          }
        }
      }

      booking.useTransaction(dbTransaction)
      booking.hasEarningBeenCreditedToDriver = true
      await booking.save()

      await dbTransaction.commit()
    } catch (processDriverWalletEarningJobError) {
      await dbTransaction.rollback()
      console.log('processDriverWalletEarningJobError => ', processDriverWalletEarningJobError)
      await logApplicationError(processDriverWalletEarningJobError)
      throw processDriverWalletEarningJobError
    }
  }

  async failed(error: Error) {
    console.error('ProcessDriverWalletEarningJob failed:', error.message)
    await logApplicationError(error)
  }
}
