import type CreateDriverBookingAssignmentRecordOptions from '#model_management/type_checking/driver_booking_assignment/create_driver_booking_assignment_record_options'
import type DbTransactionOptions from '#common/type_checkings/model_management/db_transaction_options'
import toSqlDateTime from '#common/helper_functions/to_sql_date_time'
import DriverBookingAssignment, {
  type DriverBookingAssignmentResponse,
} from '#models/driver_booking_assignment'
import { DateTime } from 'luxon'

export default class DriverBookingAssignmentActions {
  public static async createDriverBookingAssignmentRecord(
    createDriverBookingAssignmentRecordOptions: CreateDriverBookingAssignmentRecordOptions
  ): Promise<DriverBookingAssignment> {
    const { createPayload, dbTransactionOptions } = createDriverBookingAssignmentRecordOptions

    const driverBookingAssignment = new DriverBookingAssignment()
    Object.assign(driverBookingAssignment, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverBookingAssignment.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverBookingAssignment.save()

    return driverBookingAssignment
  }

  /**
   * Sets the response on the booking's pending assignment(s). When `driverId` is
   * given, only that driver's pending assignment is updated.
   */
  public static async recordDriverBookingAssignmentResponse(options: {
    bookingId: number
    driverId?: number
    response: Exclude<DriverBookingAssignmentResponse, 'pending'>
    dbTransactionOptions: DbTransactionOptions
  }): Promise<void> {
    const { bookingId, driverId, response, dbTransactionOptions } = options

    const query = DriverBookingAssignment.query()
    if (dbTransactionOptions.useTransaction) {
      query.useTransaction(dbTransactionOptions.dbTransaction)
    }
    query.where('booking_id', bookingId).where('response', 'pending')
    if (driverId !== undefined) query.where('driver_id', driverId)

    const pendingAssignments = await query

    for (const pendingAssignment of pendingAssignments) {
      if (dbTransactionOptions.useTransaction) {
        pendingAssignment.useTransaction(dbTransactionOptions.dbTransaction)
      }
      pendingAssignment.response = response
      pendingAssignment.respondedAt = DateTime.now()
      await pendingAssignment.save()
    }
  }

  /**
   * Logs a new assignment. Any earlier pending assignment on the same booking is
   * marked as reassigned first.
   */
  public static async recordDriverBookingAssignment(options: {
    bookingId: number
    driverId: number
    dbTransactionOptions: DbTransactionOptions
  }): Promise<DriverBookingAssignment> {
    const { bookingId, driverId, dbTransactionOptions } = options

    await this.recordDriverBookingAssignmentResponse({
      bookingId,
      response: 'reassigned',
      dbTransactionOptions,
    })

    return await this.createDriverBookingAssignmentRecord({
      createPayload: {
        bookingId,
        driverId,
        assignedAt: DateTime.now(),
        respondedAt: null,
        response: 'pending',
      },
      dbTransactionOptions,
    })
  }

  public static async listDriverBookingAssignmentsInWindow(options: {
    windowStart: DateTime
    windowEnd: DateTime
    driverIds?: number[]
  }): Promise<DriverBookingAssignment[]> {
    const { windowStart, windowEnd, driverIds } = options

    const query = DriverBookingAssignment.query()
      .where('assigned_at', '>=', toSqlDateTime(windowStart))
      .where('assigned_at', '<=', toSqlDateTime(windowEnd))

    if (driverIds !== undefined) {
      if (driverIds.length === 0) return []
      query.whereIn('driver_id', driverIds)
    }

    return await query
  }
}
