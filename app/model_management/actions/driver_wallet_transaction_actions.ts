import type CreateDriverWalletTransactionRecordOptions from '#model_management/type_checking/driver_wallet_transaction/create_driver_wallet_transaction_record_options'
import type ListDriverWalletTransactionRecordsOptions from '#model_management/type_checking/driver_wallet_transaction/list_driver_wallet_transaction_records_options'
import type UpdateDriverWalletTransactionRecordOptions from '#model_management/type_checking/driver_wallet_transaction/update_driver_wallet_transaction_record_options'
import type DriverWalletTransactionIdentifierOptions from '#model_management/type_checking/driver_wallet_transaction/driver_wallet_transaction_identifier_options'
import type DbTransactionOptions from '#common/type_checkings/model_management/db_transaction_options'
import DriverWalletTransaction from '#models/driver_wallet_transaction'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DriverWalletTransactionActions {
  public static async createDriverWalletTransactionRecord(
    createDriverWalletTransactionRecordOptions: CreateDriverWalletTransactionRecordOptions
  ): Promise<DriverWalletTransaction> {
    const { createPayload, dbTransactionOptions } = createDriverWalletTransactionRecordOptions

    const driverWalletTransaction = new DriverWalletTransaction()
    Object.assign(driverWalletTransaction, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverWalletTransaction.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverWalletTransaction.save()

    return driverWalletTransaction
  }

  private static async getDriverWalletTransactionById(
    driverWalletTransactionId: number,
    dbTransactionOptions?: DbTransactionOptions
  ): Promise<DriverWalletTransaction | null> {
    const query = DriverWalletTransaction.query()
      .preload('driver')
      .preload('driverWallet')
      .where('id', driverWalletTransactionId)
    if (dbTransactionOptions?.useTransaction) {
      query.useTransaction(dbTransactionOptions.dbTransaction).forUpdate()
    }
    return await query.first()
  }

  private static async getDriverWalletTransactionByIdentifier(
    driverWalletTransactionIdentifier: string,
    dbTransactionOptions?: DbTransactionOptions
  ): Promise<DriverWalletTransaction | null> {
    const query = DriverWalletTransaction.query()
      .preload('driver')
      .preload('driverWallet')
      .where('identifier', driverWalletTransactionIdentifier)
    if (dbTransactionOptions?.useTransaction) {
      query.useTransaction(dbTransactionOptions.dbTransaction).forUpdate()
    }
    return await query.first()
  }

  public static async getDriverWalletTransaction(
    getDriverWalletTransactionOptions: DriverWalletTransactionIdentifierOptions
  ): Promise<DriverWalletTransaction | null> {
    const { identifier, identifierType, dbTransactionOptions } = getDriverWalletTransactionOptions

    const GetDriverWalletTransactionIdentifierOptions: Record<string, Function> = {
      id: async () =>
        await this.getDriverWalletTransactionById(Number(identifier), dbTransactionOptions),

      identifier: async () =>
        await this.getDriverWalletTransactionByIdentifier(String(identifier), dbTransactionOptions),
    }

    return await GetDriverWalletTransactionIdentifierOptions[identifierType]()
  }

  public static async updateDriverWalletTransactionRecord(
    updateDriverWalletTransactionRecordOptions: UpdateDriverWalletTransactionRecordOptions
  ): Promise<DriverWalletTransaction | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverWalletTransactionRecordOptions

    const driverWalletTransaction = await this.getDriverWalletTransaction(identifierOptions)

    if (driverWalletTransaction === null) return null

    Object.assign(driverWalletTransaction, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverWalletTransaction.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverWalletTransaction.save()

    return driverWalletTransaction
  }

  public static async listDriverWalletTransactions(
    getDriverWalletTransactionRecordOptions: ListDriverWalletTransactionRecordsOptions
  ): Promise<{ driverWalletTransactionPayload: DriverWalletTransaction[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } =
      getDriverWalletTransactionRecordOptions

    const driverWalletTransactionQuery = DriverWalletTransaction.query()
      .preload('driver')
      .preload('driverWallet')

    if (filterRecordOptionsPayload?.driverWalletId) {
      driverWalletTransactionQuery.where(
        'driver_wallet_id',
        filterRecordOptionsPayload.driverWalletId
      )
    }
    if (filterRecordOptionsPayload?.driverId) {
      driverWalletTransactionQuery.where('driver_id', filterRecordOptionsPayload.driverId)
    }

    if (filterRecordOptionsPayload?.typeOfTransaction) {
      driverWalletTransactionQuery.where(
        'type_of_transaction',
        filterRecordOptionsPayload.typeOfTransaction
      )
    }

    if (filterRecordOptionsPayload?.status) {
      driverWalletTransactionQuery.where('status', filterRecordOptionsPayload.status)
    }

    if (filterRecordOptionsPayload?.searchQuery) {
      // Add search logic if applicable
    }

    if (paginationPayload) {
      const driverWalletTransactions = await driverWalletTransactionQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload!.page, paginationPayload!.limit)

      return {
        driverWalletTransactionPayload: driverWalletTransactions.all(),
        paginationMeta: driverWalletTransactions.getMeta(),
      }
    }
    const driverWalletTransactions = await driverWalletTransactionQuery.orderBy(
      'created_at',
      'desc'
    )
    return {
      driverWalletTransactionPayload: driverWalletTransactions,
    }
  }

  public static async getWalletTransactionMetrics(): Promise<{
    totalCreditTransactionsForPastMonth: number
    totalDebitTransactionsForPastMonth: number
    totalCreditAmountForPastMonth: number
    totalDebitAmountForPastMonth: number
  }> {
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQL()

    const result = await db
      .from('driver_wallet_transactions')
      .whereNull('deleted_at')
      .where('created_at', '>=', thirtyDaysAgo)
      .select(
        db.raw("SUM(CASE WHEN type_of_transaction = 'credit' THEN 1 ELSE 0 END) as total_credit_count"),
        db.raw("SUM(CASE WHEN type_of_transaction = 'debit' THEN 1 ELSE 0 END) as total_debit_count"),
        db.raw("SUM(CASE WHEN type_of_transaction = 'credit' THEN amount ELSE 0 END) as total_credit_amount"),
        db.raw("SUM(CASE WHEN type_of_transaction = 'debit' THEN amount ELSE 0 END) as total_debit_amount")
      )
      .first()

    return {
      totalCreditTransactionsForPastMonth: Number(result?.total_credit_count ?? 0),
      totalDebitTransactionsForPastMonth: Number(result?.total_debit_count ?? 0),
      totalCreditAmountForPastMonth: Number(result?.total_credit_amount ?? 0),
      totalDebitAmountForPastMonth: Number(result?.total_debit_amount ?? 0),
    }
  }
}
