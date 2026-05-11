import type CreateCustomerRecordOptions from '#model_management/type_checking/customer/create_customer_record_options'
import type ListCustomerRecordsOptions from '#model_management/type_checking/customer/list_customer_records_options'
import type UpdateCustomerRecordOptions from '#model_management/type_checking/customer/update_customer_record_options'
import computeMetricChangePercent from '#common/helper_functions/compute_metric_change_percent'
import type CustomerIdentifierOptions from '#model_management/type_checking/customer/customer_identifier_options'
import type DashboardMetricCard from '#model_management/type_checking/admin/dashboard_metric_card'
import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class CustomerActions {
  public static async createCustomerRecord(
    createCustomerRecordOptions: CreateCustomerRecordOptions
  ): Promise<Customer> {
    const { createPayload, dbTransactionOptions } = createCustomerRecordOptions

    const customer = new Customer()
    Object.assign(customer, createPayload)

    if (dbTransactionOptions.useTransaction) {
      customer.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customer.save()

    return customer
  }

  private static async getCustomerByEmail(email: string): Promise<Customer | null> {
    return await Customer.query().preload('customerRegistrationStep').where('email', email).first()
  }

  private static async getCustomerById(customerId: number): Promise<Customer | null> {
    return await Customer.query()
      .preload('customerRegistrationStep')
      .where('id', customerId)
      .first()
  }

  private static async getCustomerByIdentifier(
    customerIdentifier: string
  ): Promise<Customer | null> {
    return await Customer.query()
      .preload('customerRegistrationStep')
      .where('identifier', customerIdentifier)
      .first()
  }

  public static async getCustomer(
    getCustomerOptions: CustomerIdentifierOptions
  ): Promise<Customer | null> {
    const { identifier, identifierType } = getCustomerOptions

    const GetCustomerIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getCustomerById(Number(identifier)),

      identifier: async () => await this.getCustomerByIdentifier(String(identifier)),

      email: async () => await this.getCustomerByEmail(String(identifier)),
    }

    return await GetCustomerIdentifierOptions[identifierType]()
  }

  public static async updateCustomerRecord(
    updateCustomerRecordOptions: UpdateCustomerRecordOptions
  ): Promise<Customer | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateCustomerRecordOptions

    const customer = await this.getCustomer(identifierOptions)

    if (customer === null) return null

    Object.assign(customer, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      customer.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customer.save()

    return customer
  }

  public static async listCustomers(
    getCustomerRecordOptions: ListCustomerRecordsOptions
  ): Promise<{ customerPayload: Customer[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getCustomerRecordOptions

    const customerQuery = Customer.query().preload('customerRegistrationStep')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      customerQuery
        .whereILike('first_name', searchValue)
        .orWhereILike('last_name', searchValue)
        .orWhereILike('email', searchValue)
        .orWhereILike('mobile_number', searchValue)
    }

    if (paginationPayload) {
      const customers = await customerQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload!.page, paginationPayload!.limit)

      return {
        customerPayload: customers.all(),
        paginationMeta: customers.getMeta(),
      }
    }
    const customers = await customerQuery.orderBy('created_at', 'desc')
    return {
      customerPayload: customers,
    }
  }

  public static async deleteCustomerAuthenticationToken(customerId: number) {
    await db.from('auth_access_tokens').where('tokenable_id', customerId).delete()
  }

  public static async getCustomerMetrics(): Promise<{
    totalCustomerCount: number
    totalActiveCustomerForTheMonth: number
    totalNewCustomerForTheMonth: number
    totalInActiveCustomer: number
  }> {
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQL()
    const ninetyDaysAgo = DateTime.now().minus({ days: 90 }).toSQL()

    const [totalCountResult, totalActiveResult, totalNewResult, totalInactiveResult] =
      await Promise.all([
        db.from('customers').whereNull('deleted_at').count('* as total').first(),

        db
          .from('customers')
          .whereNull('deleted_at')
          .where('last_logged_in_at', '>=', thirtyDaysAgo)
          .count('* as total')
          .first(),

        db
          .from('customers')
          .whereNull('deleted_at')
          .where('created_at', '>=', thirtyDaysAgo)
          .count('* as total')
          .first(),

        db
          .from('customers')
          .whereNull('deleted_at')
          .where((query) => {
            query.where('last_logged_in_at', '<', ninetyDaysAgo).orWhereNull('last_logged_in_at')
          })
          .count('* as total')
          .first(),
      ])

    return {
      totalCustomerCount: Number(totalCountResult?.total ?? 0),
      totalActiveCustomerForTheMonth: Number(totalActiveResult?.total ?? 0),
      totalNewCustomerForTheMonth: Number(totalNewResult?.total ?? 0),
      totalInActiveCustomer: Number(totalInactiveResult?.total ?? 0),
    }
  }

  /**
   * Admin home dashboard — customers section (retention, acquisition, inactivity).
   */
  public static async getAdminDashboardCustomerStats(): Promise<{
    total: DashboardMetricCard
    activeLast30Days: DashboardMetricCard
    newThisCalendarMonth: DashboardMetricCard
    inactive90PlusDays: DashboardMetricCard
    comparisonNote: string
  }> {
    const now = DateTime.now()
    const thirtyDaysAgo = now.minus({ days: 30 }).toSQL()
    const sixtyDaysAgo = now.minus({ days: 60 }).toSQL()
    const ninetyDaysAgo = now.minus({ days: 90 }).toSQL()
    const startOfThisMonth = now.startOf('month').toSQL()
    const startOfLastMonth = now.startOf('month').minus({ months: 1 }).toSQL()

    const [
      totalCountRow,
      newSignupsCurrent30Row,
      newSignupsPrevious30Row,
      activeLast30Row,
      newThisMonthRow,
      newLastMonthRow,
      inactiveRow,
    ] = await Promise.all([
      db.from('customers').whereNull('deleted_at').count('* as total').first(),

      db
        .from('customers')
        .whereNull('deleted_at')
        .where('created_at', '>=', thirtyDaysAgo)
        .count('* as total')
        .first(),

      db
        .from('customers')
        .whereNull('deleted_at')
        .where('created_at', '>=', sixtyDaysAgo)
        .where('created_at', '<', thirtyDaysAgo)
        .count('* as total')
        .first(),

      db
        .from('customers')
        .whereNull('deleted_at')
        .where('last_logged_in_at', '>=', thirtyDaysAgo)
        .count('* as total')
        .first(),

      db
        .from('customers')
        .whereNull('deleted_at')
        .where('created_at', '>=', startOfThisMonth)
        .count('* as total')
        .first(),

      db
        .from('customers')
        .whereNull('deleted_at')
        .where('created_at', '>=', startOfLastMonth)
        .where('created_at', '<', startOfThisMonth)
        .count('* as total')
        .first(),

      db
        .from('customers')
        .whereNull('deleted_at')
        .where((query) => {
          query.where('last_logged_in_at', '<', ninetyDaysAgo).orWhereNull('last_logged_in_at')
        })
        .count('* as total')
        .first(),
    ])

    const totalCustomers = Number(totalCountRow?.total ?? 0)
    const new30Current = Number(newSignupsCurrent30Row?.total ?? 0)
    const new30Previous = Number(newSignupsPrevious30Row?.total ?? 0)
    const newThisMonth = Number(newThisMonthRow?.total ?? 0)
    const newLastMonth = Number(newLastMonthRow?.total ?? 0)

    return {
      total: {
        value: totalCustomers,
        currentPeriodValue: new30Current,
        previousPeriodValue: new30Previous,
        changePercentVsPreviousPeriod: computeMetricChangePercent(new30Previous, new30Current),
        trendBasis: 'new_customer_registrations_last_30d_vs_prior_30d',
      },
      activeLast30Days: {
        value: Number(activeLast30Row?.total ?? 0),
        currentPeriodValue: null,
        previousPeriodValue: null,
        changePercentVsPreviousPeriod: null,
      },
      newThisCalendarMonth: {
        value: newThisMonth,
        currentPeriodValue: newThisMonth,
        previousPeriodValue: newLastMonth,
        changePercentVsPreviousPeriod: computeMetricChangePercent(newLastMonth, newThisMonth),
      },
      inactive90PlusDays: {
        value: Number(inactiveRow?.total ?? 0),
        currentPeriodValue: null,
        previousPeriodValue: null,
        changePercentVsPreviousPeriod: null,
      },
      comparisonNote:
        'Total customers is all-time count; its trend compares new sign-ups in the last 30 days vs the prior 30 days. "New this month" compares the current calendar month to the previous calendar month.',
    }
  }
}
