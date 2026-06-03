import type CreateBookingRecordOptions from '#model_management/type_checking/booking/create_booking_record_options'
import type ListBookingRecordsOptions from '#model_management/type_checking/booking/list_booking_records_options'
import type UpdateBookingRecordOptions from '#model_management/type_checking/booking/update_booking_record_options'
import type BookingIdentifierOptions from '#model_management/type_checking/booking/booking_identifier_options'
import computeMetricChangePercent from '#common/helper_functions/compute_metric_change_percent'
import type DashboardMetricCard from '#model_management/type_checking/admin/dashboard_metric_card'
import Booking from '#models/booking'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class BookingActions {
  public static async createBookingRecord(
    createBookingRecordOptions: CreateBookingRecordOptions
  ): Promise<Booking> {
    const { createPayload, dbTransactionOptions } = createBookingRecordOptions

    const booking = new Booking()
    Object.assign(booking, createPayload)

    if (dbTransactionOptions.useTransaction) {
      booking.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await booking.save()

    return booking
  }

  private static async getBookingById(bookingId: number): Promise<Booking | null> {
    return await Booking.query()
      .preload('rideType')
      .preload('customer')
      .preload('bookingPayment')
      .preload('assignedDriver')
      .preload('bookingGpsLogs')
      .preload('bookingReviews')
      .where('id', bookingId)
      .first()
  }

  private static async getBookingByIdentifier(bookingIdentifier: string): Promise<Booking | null> {
    return await Booking.query()
      .preload('rideType')
      .preload('customer')
      .preload('bookingPayment')
      .preload('assignedDriver')
      .preload('bookingGpsLogs')
      .preload('bookingReviews')
      .where('identifier', bookingIdentifier)
      .first()
  }

  public static async getBooking(
    getBookingOptions: BookingIdentifierOptions
  ): Promise<Booking | null> {
    const { identifier, identifierType } = getBookingOptions

    const GetBookingIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getBookingById(Number(identifier)),

      identifier: async () => await this.getBookingByIdentifier(String(identifier)),
    }

    return await GetBookingIdentifierOptions[identifierType]()
  }

  public static async updateBookingRecord(
    updateBookingRecordOptions: UpdateBookingRecordOptions
  ): Promise<Booking | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateBookingRecordOptions

    const booking = await this.getBooking(identifierOptions)

    if (booking === null) return null

    Object.assign(booking, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      booking.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await booking.save()

    return booking
  }

  public static async listBookings(
    getBookingRecordOptions: ListBookingRecordsOptions
  ): Promise<{ bookingPayload: Booking[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getBookingRecordOptions

    const bookingQuery = Booking.query()
      .preload('rideType')
      .preload('customer')
      .preload('bookingPayment')
      .preload('assignedDriver')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      bookingQuery
        .whereILike('identifier', searchValue)
        .orWhereILike('departure_location_name', searchValue)
        .orWhereILike('destination_location_name', searchValue)
    }

    if (filterRecordOptionsPayload?.rideTypeId) {
      bookingQuery.where('ride_type_id', filterRecordOptionsPayload.rideTypeId)
    }

    if (typeof filterRecordOptionsPayload?.isRecurringBooking === 'boolean') {
      bookingQuery.where('is_recurring_booking', filterRecordOptionsPayload.isRecurringBooking)
    }

    if (filterRecordOptionsPayload?.paymentStatus) {
      bookingQuery.whereHas('bookingPayment', (query) => {
        query.where('payment_status', String(filterRecordOptionsPayload.paymentStatus))
      })
    }

    if (filterRecordOptionsPayload?.status) {
      bookingQuery.where('status', filterRecordOptionsPayload.status)
    }

    if (filterRecordOptionsPayload?.customerId) {
      bookingQuery.where('customer_id', filterRecordOptionsPayload.customerId)
    }

    if (filterRecordOptionsPayload?.assignedDriverId) {
      bookingQuery.where('assigned_driver_id', filterRecordOptionsPayload.assignedDriverId)
    }

    if (paginationPayload) {
      const bookings = await bookingQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        bookingPayload: bookings.all(),
        paginationMeta: bookings.getMeta(),
      }
    }

    const bookings = await bookingQuery.orderBy('created_at', 'desc')
    return {
      bookingPayload: bookings,
    }
  }

  public static async listBookingsWithUncreditedDriverEarnings(): Promise<{
    bookingPayload: Booking[]
  }> {
    const bookings = await Booking.query()
      .where('status', 'completed')
      .where('has_earning_been_credited_to_driver', false)
      .orderBy('created_at', 'asc')

    return {
      bookingPayload: bookings,
    }
  }

  public static async getTotalDriverBookingEarnings(driverId: number): Promise<number> {
    const bookingEarnings = await db
      .from('bookings')
      .join('booking_payments', 'booking_payments.booking_id', 'bookings.id')
      .where('bookings.assigned_driver_id', driverId)
      .where('bookings.has_earning_been_credited_to_driver', true)
      .whereNull('bookings.deleted_at')
      .sum('booking_payments.amount_paid as total_earnings')
      .first()

    return bookingEarnings?.total_earnings ?? 0
  }

  public static async getTotalDriverCompletedBookings(driverId: number): Promise<number> {
    const bookingTotal = await db
      .from('bookings')
      .where('assigned_driver_id', driverId)
      .where('status', 'completed')
      .whereNull('deleted_at')
      .count('* as total')
      .first()

    return bookingTotal?.total ?? 0
  }

  public static async getBookingMetrics(): Promise<{
    totalBookingsForPastMonth: number
    totalCompletedBookingsForPastMonth: number
    totalCancelledBookingsForPastMonth: number
  }> {
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQL()

    const result = await db
      .from('bookings')
      .whereNull('deleted_at')
      .where('created_at', '>=', thirtyDaysAgo)
      .select(
        db.raw('COUNT(*) as total'),
        db.raw("SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as total_completed"),
        db.raw("SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as total_cancelled")
      )
      .first()

    return {
      totalBookingsForPastMonth: Number(result?.total ?? 0),
      totalCompletedBookingsForPastMonth: Number(result?.total_completed ?? 0),
      totalCancelledBookingsForPastMonth: Number(result?.total_cancelled ?? 0),
    }
  }

  private static buildPeriodMetricCard(
    currentPeriodValue: number,
    previousPeriodValue: number
  ): DashboardMetricCard {
    return {
      value: currentPeriodValue,
      currentPeriodValue,
      previousPeriodValue,
      changePercentVsPreviousPeriod: computeMetricChangePercent(
        previousPeriodValue,
        currentPeriodValue
      ),
    }
  }

  /**
   * Admin home dashboard — bookings section (rolling 30d vs prior 30d + live pending queue).
   */
  public static async getAdminDashboardBookingStats(): Promise<{
    total: DashboardMetricCard
    completed: DashboardMetricCard
    cancelled: DashboardMetricCard
    pendingAwaitingDriverAssignment: DashboardMetricCard
    inProgress: DashboardMetricCard
    comparisonNote: string
  }> {
    const now = DateTime.now()
    const thirtyDaysAgo = now.minus({ days: 30 }).toSQL()
    const sixtyDaysAgo = now.minus({ days: 60 }).toSQL()

    const [currentPeriod, previousPeriod, pendingRow, inProgressRow] = await Promise.all([
      db
        .from('bookings')
        .whereNull('deleted_at')
        .where('created_at', '>=', thirtyDaysAgo)
        .select(
          db.raw('COUNT(*) as total'),
          db.raw("SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as total_completed"),
          db.raw("SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as total_cancelled")
        )
        .first(),

      db
        .from('bookings')
        .whereNull('deleted_at')
        .where('created_at', '>=', sixtyDaysAgo)
        .where('created_at', '<', thirtyDaysAgo)
        .select(
          db.raw('COUNT(*) as total'),
          db.raw("SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as total_completed"),
          db.raw("SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as total_cancelled")
        )
        .first(),

      db
        .from('bookings')
        .whereNull('deleted_at')
        .where('status', 'created')
        .count('* as total')
        .first(),

      db
        .from('bookings')
        .whereNull('deleted_at')
        .whereIn('status', ['assigned-a-driver', 'accepted'])
        .count('* as total')
        .first(),
    ])

    const curTotal = Number(currentPeriod?.total ?? 0)
    const prevTotal = Number(previousPeriod?.total ?? 0)
    const curCompleted = Number(currentPeriod?.total_completed ?? 0)
    const prevCompleted = Number(previousPeriod?.total_completed ?? 0)
    const curCancelled = Number(currentPeriod?.total_cancelled ?? 0)
    const prevCancelled = Number(previousPeriod?.total_cancelled ?? 0)

    const pending = Number(pendingRow?.total ?? 0)
    const inProgress = Number(inProgressRow?.total ?? 0)

    return {
      total: this.buildPeriodMetricCard(curTotal, prevTotal),
      completed: this.buildPeriodMetricCard(curCompleted, prevCompleted),
      cancelled: this.buildPeriodMetricCard(curCancelled, prevCancelled),
      pendingAwaitingDriverAssignment: {
        value: pending,
        currentPeriodValue: null,
        previousPeriodValue: null,
        changePercentVsPreviousPeriod: null,
      },
      inProgress: {
        value: inProgress,
        currentPeriodValue: null,
        previousPeriodValue: null,
        changePercentVsPreviousPeriod: null,
      },
      comparisonNote: 'Booking volume metrics compare the last 30 days to the prior 30 days.',
    }
  }
}
