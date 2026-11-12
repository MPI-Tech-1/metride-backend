import type CreateDriverOnlineSessionRecordOptions from '#model_management/type_checking/driver_online_session/create_driver_online_session_record_options'
import type DbTransactionOptions from '#common/type_checkings/model_management/db_transaction_options'
import toSqlDateTime from '#common/helper_functions/to_sql_date_time'
import DriverOnlineSession from '#models/driver_online_session'
import { DateTime } from 'luxon'

export default class DriverOnlineSessionActions {
  public static async createDriverOnlineSessionRecord(
    createDriverOnlineSessionRecordOptions: CreateDriverOnlineSessionRecordOptions
  ): Promise<DriverOnlineSession> {
    const { createPayload, dbTransactionOptions } = createDriverOnlineSessionRecordOptions

    const driverOnlineSession = new DriverOnlineSession()
    Object.assign(driverOnlineSession, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverOnlineSession.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverOnlineSession.save()

    return driverOnlineSession
  }

  public static async getOpenDriverOnlineSession(
    driverId: number,
    dbTransactionOptions?: DbTransactionOptions
  ): Promise<DriverOnlineSession | null> {
    const query = DriverOnlineSession.query()
    if (dbTransactionOptions?.useTransaction) {
      query.useTransaction(dbTransactionOptions.dbTransaction)
    }
    return await query
      .where('driver_id', driverId)
      .whereNull('ended_at')
      .orderBy('started_at', 'desc')
      .first()
  }

  /**
   * Opens a session when the driver goes online. Does nothing if one is already open,
   * so repeated "enable" calls do not create overlapping sessions.
   */
  public static async openDriverOnlineSession(
    driverId: number,
    dbTransactionOptions: DbTransactionOptions
  ): Promise<DriverOnlineSession> {
    const openSession = await this.getOpenDriverOnlineSession(driverId, dbTransactionOptions)
    if (openSession) return openSession

    return await this.createDriverOnlineSessionRecord({
      createPayload: { driverId, startedAt: DateTime.now(), endedAt: null },
      dbTransactionOptions,
    })
  }

  /**
   * Closes every open session for the driver when they go offline.
   */
  public static async closeDriverOnlineSessions(
    driverId: number,
    dbTransactionOptions: DbTransactionOptions
  ): Promise<void> {
    const query = DriverOnlineSession.query()
    if (dbTransactionOptions.useTransaction) {
      query.useTransaction(dbTransactionOptions.dbTransaction)
    }
    const openSessions = await query.where('driver_id', driverId).whereNull('ended_at')

    for (const openSession of openSessions) {
      if (dbTransactionOptions.useTransaction) {
        openSession.useTransaction(dbTransactionOptions.dbTransaction)
      }
      openSession.endedAt = DateTime.now()
      await openSession.save()
    }
  }

  /**
   * Sessions that overlap [windowStart, windowEnd]. Open sessions are included.
   */
  public static async listDriverOnlineSessionsOverlappingWindow(options: {
    windowStart: DateTime
    windowEnd: DateTime
    driverId?: number
  }): Promise<DriverOnlineSession[]> {
    const { windowStart, windowEnd, driverId } = options

    const query = DriverOnlineSession.query()
      .where('started_at', '<', toSqlDateTime(windowEnd))
      .where((endedAtQuery) =>
        endedAtQuery.whereNull('ended_at').orWhere('ended_at', '>', toSqlDateTime(windowStart))
      )

    if (driverId !== undefined) query.where('driver_id', driverId)

    return await query.orderBy('started_at', 'asc')
  }
}
