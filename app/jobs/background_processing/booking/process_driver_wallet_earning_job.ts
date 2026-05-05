import BookingActions from '#model_management/actions/booking_actions'
import DriverWalletActions from '#model_management/actions/driver_wallet_actions'
import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import db from '@adonisjs/lucid/services/db'
import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { randomUUID } from 'node:crypto'

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

    const booking = await BookingActions.getBooking({
      identifierType: 'id',
      identifier: bookingId,
    })

    if (!booking) {
      throw new Error('ProcessDriverWalletEarningJob: booking not found')
    }

    if (booking.status !== 'completed') {
      throw new Error('ProcessDriverWalletEarningJob: booking has not been completed')
    }

    if (booking.hasEarningBeenCreditedToDriver === true) {
      throw new Error('ProcessDriverWalletEarningJob: booking earning has been credited to driver')
    }

    if (!booking.assignedDriverId) {
      throw new Error('ProcessDriverWalletEarningJob: booking has no assigned driver')
    }

    const dbTransaction = await db.transaction()

    try {
      const wallet = await DriverWalletActions.getDriverWallet({
        identifierType: 'driverId',
        identifier: booking.assignedDriverId,
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
      })

      if (!wallet) {
        throw new Error('ProcessDriverWalletEarningJob: driver wallet not found')
      }

      const earningAmount = booking.bookingPayment.amountPaid

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

      await dbTransaction.commit()
    } catch (processDriverWalletEarningJobError) {
      await dbTransaction.rollback()
      console.log('processDriverWalletEarningJobError => ', processDriverWalletEarningJobError)
    }
  }

  async failed(error: Error) {
    console.error('ProcessDriverWalletEarningJob failed:', error.message)
  }
}
