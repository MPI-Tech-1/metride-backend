import type CreateDriverRecordOptions from '#model_management/type_checking/driver/create_driver_record_options'
import type ListDriverRecordsOptions from '#model_management/type_checking/driver/list_driver_records_options'
import type UpdateDriverRecordOptions from '#model_management/type_checking/driver/update_driver_record_options'
import computeMetricChangePercent from '#common/helper_functions/compute_metric_change_percent'
import type DriverIdentifierOptions from '#model_management/type_checking/driver/driver_identifier_options'
import type DashboardMetricCard from '#model_management/type_checking/admin/dashboard_metric_card'
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
      .preload('driverSetting')
      .preload('driverPersonalInformation')
      .preload('driverApprovalSteps', (driverApprovalStepsQuery) =>
        driverApprovalStepsQuery.preload('performedByAdmin')
      )
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
      .preload('driverSetting')
      .preload('driverPersonalInformation')
      .preload('driverApprovalSteps', (driverApprovalStepsQuery) =>
        driverApprovalStepsQuery.preload('performedByAdmin')
      )
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
      .preload('driverSetting')
      .preload('driverPersonalInformation')
      .preload('driverApprovalSteps', (driverApprovalStepsQuery) =>
        driverApprovalStepsQuery.preload('performedByAdmin')
      )
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

    const TODAY = DateTime.now().toISODate()

    const driverQuery = Driver.query()
      .preload('assignedBookings')
      .preload('driverLocations', (driverLocationQuery) =>
        driverLocationQuery.whereRaw('DATE(created_at) = ? ', [TODAY]).orderBy('created_at', 'desc')
      )

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      driverQuery
        .whereILike('first_name', searchValue)
        .orWhereILike('last_name', searchValue)
        .orWhereILike('email', searchValue)
    }

    if (typeof filterRecordOptionsPayload?.isDriverActiveForTrip === 'boolean') {
      driverQuery.where(
        'is_driver_active_for_trip',
        filterRecordOptionsPayload.isDriverActiveForTrip
      )
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
        db
          .from('bookings')
          .whereNull('deleted_at')
          .where('status', 'completed')
          .count('* as total')
          .first(),

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
      totalAcceptanceRate:
        totalAssigned > 0 ? Math.round((totalAccepted / totalAssigned) * 100) : 0,
      totalCancellationRate:
        totalBookings > 0 ? Math.round((totalCancelled / totalBookings) * 100) : 0,
    }
  }

  /**
   * Admin home dashboard — drivers section (catalog + activity + registration momentum).
   */
  public static async getAdminDashboardDriverStats(): Promise<{
    total: DashboardMetricCard
    activeLast24Hours: DashboardMetricCard
    approved: DashboardMetricCard
    pendingApproval: DashboardMetricCard
    rejected: DashboardMetricCard
    comparisonNote: string
  }> {
    const now = DateTime.now()
    const twentyFourHoursAgo = now.minus({ hours: 24 }).toSQL()
    const thirtyDaysAgo = now.minus({ days: 30 }).toSQL()
    const sixtyDaysAgo = now.minus({ days: 60 }).toSQL()

    const [
      totalDriversRow,
      newDriversCurrentWindowRow,
      newDriversPreviousWindowRow,
      active24hRow,
      approvedRow,
      pendingRow,
      rejectedRow,
    ] = await Promise.all([
      db.from('drivers').whereNull('deleted_at').count('* as total').first(),

      db
        .from('drivers')
        .whereNull('deleted_at')
        .where('created_at', '>=', thirtyDaysAgo)
        .count('* as total')
        .first(),

      db
        .from('drivers')
        .whereNull('deleted_at')
        .where('created_at', '>=', sixtyDaysAgo)
        .where('created_at', '<', thirtyDaysAgo)
        .count('* as total')
        .first(),

      db
        .from('drivers')
        .whereNull('deleted_at')
        .where('last_logged_in_at', '>=', twentyFourHoursAgo)
        .count('* as total')
        .first(),

      db
        .from('drivers')
        .whereNull('deleted_at')
        .where('status', 'approved')
        .count('* as total')
        .first(),

      db
        .from('drivers')
        .whereNull('deleted_at')
        .where('status', 'pending')
        .count('* as total')
        .first(),

      db
        .from('drivers')
        .whereNull('deleted_at')
        .where('status', 'rejected')
        .count('* as total')
        .first(),
    ])

    const totalDrivers = Number(totalDriversRow?.total ?? 0)
    const newCurrent = Number(newDriversCurrentWindowRow?.total ?? 0)
    const newPrevious = Number(newDriversPreviousWindowRow?.total ?? 0)

    return {
      total: {
        value: totalDrivers,
        currentPeriodValue: newCurrent,
        previousPeriodValue: newPrevious,
        changePercentVsPreviousPeriod: computeMetricChangePercent(newPrevious, newCurrent),
        trendBasis: 'new_driver_registrations_last_30d_vs_prior_30d',
      },
      activeLast24Hours: {
        value: Number(active24hRow?.total ?? 0),
        currentPeriodValue: null,
        previousPeriodValue: null,
        changePercentVsPreviousPeriod: null,
      },
      approved: {
        value: Number(approvedRow?.total ?? 0),
        currentPeriodValue: null,
        previousPeriodValue: null,
        changePercentVsPreviousPeriod: null,
      },
      pendingApproval: {
        value: Number(pendingRow?.total ?? 0),
        currentPeriodValue: null,
        previousPeriodValue: null,
        changePercentVsPreviousPeriod: null,
      },
      rejected: {
        value: Number(rejectedRow?.total ?? 0),
        currentPeriodValue: null,
        previousPeriodValue: null,
        changePercentVsPreviousPeriod: null,
      },
      comparisonNote:
        'Total drivers card shows all-time count; trend compares new driver registrations in the last 30 days vs the prior 30 days.',
    }
  }
}
