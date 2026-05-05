import type CreateDriverWalletWithdrawalRequestRecordOptions from '#model_management/type_checking/driver_wallet_withdrawal_request/create_driver_wallet_withdrawal_request_record_options'
import type ListDriverWalletWithdrawalRequestRecordsOptions from '#model_management/type_checking/driver_wallet_withdrawal_request/list_driver_wallet_withdrawal_request_records_options'
import type UpdateDriverWalletWithdrawalRequestRecordOptions from '#model_management/type_checking/driver_wallet_withdrawal_request/update_driver_wallet_withdrawal_request_record_options'
import type DriverWalletWithdrawalRequestIdentifierOptions from '#model_management/type_checking/driver_wallet_withdrawal_request/driver_wallet_withdrawal_request_identifier_options'
import type DbTransactionOptions from '#common/type_checkings/model_management/db_transaction_options'
import DriverWalletWithdrawalRequest from '#models/driver_wallet_withdrawal_request'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DriverWalletWithdrawalRequestActions {
  public static async createDriverWalletWithdrawalRequestRecord(
    createDriverWalletWithdrawalRequestRecordOptions: CreateDriverWalletWithdrawalRequestRecordOptions
  ): Promise<DriverWalletWithdrawalRequest> {
    const { createPayload, dbTransactionOptions } = createDriverWalletWithdrawalRequestRecordOptions

    const driverWalletWithdrawalRequest = new DriverWalletWithdrawalRequest()
    Object.assign(driverWalletWithdrawalRequest, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverWalletWithdrawalRequest.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverWalletWithdrawalRequest.save()

    return driverWalletWithdrawalRequest
  }

  private static async getDriverWalletWithdrawalRequestById(
    driverWalletWithdrawalRequestId: number,
    dbTransactionOptions?: DbTransactionOptions
  ): Promise<DriverWalletWithdrawalRequest | null> {
    const query = DriverWalletWithdrawalRequest.query()
      .preload('driver')
      .preload('driverWallet')
      .where('id', driverWalletWithdrawalRequestId)
    if (dbTransactionOptions?.useTransaction) {
      query.useTransaction(dbTransactionOptions.dbTransaction).forUpdate()
    }
    return await query.first()
  }

  private static async getDriverWalletWithdrawalRequestByIdentifier(
    driverWalletWithdrawalRequestIdentifier: string,
    dbTransactionOptions?: DbTransactionOptions
  ): Promise<DriverWalletWithdrawalRequest | null> {
    const query = DriverWalletWithdrawalRequest.query()
      .preload('driver')
      .preload('driverWallet')
      .where('identifier', driverWalletWithdrawalRequestIdentifier)
    if (dbTransactionOptions?.useTransaction) {
      query.useTransaction(dbTransactionOptions.dbTransaction).forUpdate()
    }
    return await query.first()
  }

  public static async getDriverWalletWithdrawalRequest(
    getDriverWalletWithdrawalRequestOptions: DriverWalletWithdrawalRequestIdentifierOptions
  ): Promise<DriverWalletWithdrawalRequest | null> {
    const { identifier, identifierType, dbTransactionOptions } =
      getDriverWalletWithdrawalRequestOptions

    const GetDriverWalletWithdrawalRequestIdentifierOptions: Record<string, Function> = {
      id: async () =>
        await this.getDriverWalletWithdrawalRequestById(Number(identifier), dbTransactionOptions),

      identifier: async () =>
        await this.getDriverWalletWithdrawalRequestByIdentifier(
          String(identifier),
          dbTransactionOptions
        ),
    }

    return await GetDriverWalletWithdrawalRequestIdentifierOptions[identifierType]()
  }

  public static async updateDriverWalletWithdrawalRequestRecord(
    updateDriverWalletWithdrawalRequestRecordOptions: UpdateDriverWalletWithdrawalRequestRecordOptions
  ): Promise<DriverWalletWithdrawalRequest | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverWalletWithdrawalRequestRecordOptions

    const driverWalletWithdrawalRequest =
      await this.getDriverWalletWithdrawalRequest(identifierOptions)

    if (driverWalletWithdrawalRequest === null) return null

    Object.assign(driverWalletWithdrawalRequest, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverWalletWithdrawalRequest.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverWalletWithdrawalRequest.save()

    return driverWalletWithdrawalRequest
  }

  public static async listDriverWalletWithdrawalRequests(
    getDriverWalletWithdrawalRequestRecordOptions: ListDriverWalletWithdrawalRequestRecordsOptions
  ): Promise<{
    driverWalletWithdrawalRequestPayload: DriverWalletWithdrawalRequest[]
    paginationMeta?: any
  }> {
    const { filterRecordOptionsPayload, paginationPayload } =
      getDriverWalletWithdrawalRequestRecordOptions

    const driverWalletWithdrawalRequestQuery = DriverWalletWithdrawalRequest.query()
      .preload('driver')
      .preload('driverWallet')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      driverWalletWithdrawalRequestQuery
        .whereILike('identifier', searchValue)
        .orWhereILike('status', searchValue)
    }

    if (filterRecordOptionsPayload?.driverId) {
      driverWalletWithdrawalRequestQuery.where('driver_id', filterRecordOptionsPayload.driverId)
    }

    if (filterRecordOptionsPayload?.driverWalletId) {
      driverWalletWithdrawalRequestQuery.where(
        'driver_wallet_id',
        filterRecordOptionsPayload.driverWalletId
      )
    }

    if (filterRecordOptionsPayload?.status) {
      driverWalletWithdrawalRequestQuery.where('status', filterRecordOptionsPayload.status)
    }

    if (paginationPayload) {
      const driverWalletWithdrawalRequests = await driverWalletWithdrawalRequestQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverWalletWithdrawalRequestPayload: driverWalletWithdrawalRequests.all(),
        paginationMeta: driverWalletWithdrawalRequests.getMeta(),
      }
    }

    const driverWalletWithdrawalRequests = await driverWalletWithdrawalRequestQuery.orderBy(
      'created_at',
      'desc'
    )
    return {
      driverWalletWithdrawalRequestPayload: driverWalletWithdrawalRequests,
    }
  }

  public static async getPayoutMetrics(): Promise<{
    totalPendingPayouts: number
    totalApprovedPayoutsForPastMonth: number
    totalRejectedPayoutsForPastMonth: number
    totalApprovedPayoutAmountForPastMonth: number
  }> {
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQL()

    const [pendingResult, monthlyResult] = await Promise.all([
      db
        .from('driver_wallet_withdrawal_requests')
        .whereNull('deleted_at')
        .where('status', 'pending')
        .count('* as total')
        .first(),

      db
        .from('driver_wallet_withdrawal_requests')
        .whereNull('deleted_at')
        .where('created_at', '>=', thirtyDaysAgo)
        .select(
          db.raw("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as total_approved"),
          db.raw("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as total_rejected"),
          db.raw("SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as total_approved_amount")
        )
        .first(),
    ])

    return {
      totalPendingPayouts: Number(pendingResult?.total ?? 0),
      totalApprovedPayoutsForPastMonth: Number(monthlyResult?.total_approved ?? 0),
      totalRejectedPayoutsForPastMonth: Number(monthlyResult?.total_rejected ?? 0),
      totalApprovedPayoutAmountForPastMonth: Number(monthlyResult?.total_approved_amount ?? 0),
    }
  }
}
