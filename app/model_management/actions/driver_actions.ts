import type CreateDriverRecordOptions from '#model_management/type_checking/driver/create_driver_record_options'
import type ListDriverRecordsOptions from '#model_management/type_checking/driver/list_driver_records_options'
import type UpdateDriverRecordOptions from '#model_management/type_checking/driver/update_driver_record_options'
import type DriverIdentifierOptions from '#model_management/type_checking/driver/driver_identifier_options'
import Driver from '#models/driver'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DriverActions {
  public static async createDriverRecord(
    createDriverRecordOptions: CreateDriverRecordOptions
  ): Promise<Driver> {
    const { createPayload, dbTransactionOptions } = createDriverRecordOptions

    const driver = new Driver()
    Object.assign(driver, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driver.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driver.save()

    return driver
  }

  private static async getDriverByEmail(email: string): Promise<Driver | null> {
    return await Driver.query()
      .preload('driverRegistrationStep')
      .preload('driverBankAccount', (driverBankAccountQuery) =>
        driverBankAccountQuery.preload('bank')
      )
      .preload('driverDocument')
      .preload('driverPersonalInformation')
      .preload('driverApprovalSteps')
      .where('email', email)
      .first()
  }

  private static async getDriverById(driverId: number): Promise<Driver | null> {
    return await Driver.query()
      .preload('driverRegistrationStep')
      .preload('driverBankAccount', (driverBankAccountQuery) =>
        driverBankAccountQuery.preload('bank')
      )
      .preload('driverDocument')
      .preload('driverPersonalInformation')
      .preload('driverApprovalSteps')
      .where('id', driverId)
      .first()
  }

  private static async getDriverByIdentifier(driverIdentifier: string): Promise<Driver | null> {
    return await Driver.query()
      .preload('driverRegistrationStep')
      .preload('driverBankAccount', (driverBankAccountQuery) =>
        driverBankAccountQuery.preload('bank')
      )
      .preload('driverDocument')
      .preload('driverPersonalInformation')
      .preload('driverApprovalSteps')
      .where('identifier', driverIdentifier)
      .first()
  }

  public static async getDriver(getDriverOptions: DriverIdentifierOptions): Promise<Driver | null> {
    const { identifier, identifierType } = getDriverOptions

    const GetDriverIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverById(Number(identifier)),

      identifier: async () => await this.getDriverByIdentifier(String(identifier)),

      email: async () => await this.getDriverByEmail(String(identifier)),
    }

    return await GetDriverIdentifierOptions[identifierType]()
  }

  public static async updateDriverRecord(
    updateDriverRecordOptions: UpdateDriverRecordOptions
  ): Promise<Driver | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateDriverRecordOptions

    const driver = await this.getDriver(identifierOptions)

    if (driver === null) return null

    Object.assign(driver, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driver.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driver.save()

    return driver
  }

  public static async listDrivers(
    getDriverRecordOptions: ListDriverRecordsOptions
  ): Promise<{ driverPayload: Driver[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getDriverRecordOptions

    const driverQuery = Driver.query().preload('assignedBookings')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      driverQuery
        .whereILike('first_name', searchValue)
        .orWhereILike('last_name', searchValue)
        .orWhereILike('email', searchValue)
    }

    if (paginationPayload) {
      const drivers = await driverQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverPayload: drivers.all(),
        paginationMeta: drivers.getMeta(),
      }
    }

    const drivers = await driverQuery.orderBy('created_at', 'desc')
    return {
      driverPayload: drivers,
    }
  }

  public static async deleteDriverAuthenticationToken(driverId: number) {
    await db.from('auth_access_tokens').where('tokenable_id', driverId).delete()
  }

  public static async getDriverMetrics(): Promise<{
    totalNumberOfTrips: number
    totalAcceptanceRate: number
    totalNumberOfActiveDrivers: number
    totalCancellationRate: number
  }> {
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQL()
    const twentyFourHoursAgo = DateTime.now().minus({ hours: 24 }).toSQL()

    const [totalTripsResult, acceptanceStats, activeDriversResult, cancellationStats] =
      await Promise.all([
        db.from('bookings').whereNull('deleted_at').where('status', 'completed').count('* as total').first(),

        db
          .from('bookings')
          .whereNull('deleted_at')
          .whereNotNull('assigned_driver_id')
          .where('created_at', '>=', thirtyDaysAgo)
          .select(
            db.raw('COUNT(*) as total_assigned'),
            db.raw(
              "SUM(CASE WHEN status IN ('accepted', 'completed', 'enroute-to-pickup', 'enroute-to-dropoff') THEN 1 ELSE 0 END) as total_accepted"
            )
          )
          .first(),

        db
          .from('drivers')
          .whereNull('deleted_at')
          .where('last_logged_in_at', '>=', twentyFourHoursAgo)
          .count('* as total')
          .first(),

        db
          .from('bookings')
          .whereNull('deleted_at')
          .where('created_at', '>=', thirtyDaysAgo)
          .select(
            db.raw('COUNT(*) as total'),
            db.raw("SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as total_cancelled")
          )
          .first(),
      ])

    const totalAssigned = Number(acceptanceStats?.total_assigned ?? 0)
    const totalAccepted = Number(acceptanceStats?.total_accepted ?? 0)
    const totalBookings = Number(cancellationStats?.total ?? 0)
    const totalCancelled = Number(cancellationStats?.total_cancelled ?? 0)

    return {
      totalNumberOfTrips: Number(totalTripsResult?.total ?? 0),
      totalNumberOfActiveDrivers: Number(activeDriversResult?.total ?? 0),
      totalAcceptanceRate: totalAssigned > 0 ? Math.round((totalAccepted / totalAssigned) * 100) : 0,
      totalCancellationRate: totalBookings > 0 ? Math.round((totalCancelled / totalBookings) * 100) : 0,
    }
  }
}
