import type CreateDriverWalletTransactionRecordOptions from '#model_management/type_checking/driver_wallet_transaction/create_driver_wallet_transaction_record_options'
import type ListDriverWalletTransactionRecordsOptions from '#model_management/type_checking/driver_wallet_transaction/list_driver_wallet_transaction_records_options'
import type UpdateDriverWalletTransactionRecordOptions from '#model_management/type_checking/driver_wallet_transaction/update_driver_wallet_transaction_record_options'
import type DriverWalletTransactionIdentifierOptions from '#model_management/type_checking/driver_wallet_transaction/driver_wallet_transaction_identifier_options'
import DriverWalletTransaction from '#models/driver_wallet_transaction'

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
    driverWalletTransactionId: number
  ): Promise<DriverWalletTransaction | null> {
    return await DriverWalletTransaction.query().where('id', driverWalletTransactionId).first()
  }

  private static async getDriverWalletTransactionByIdentifier(
    driverWalletTransactionIdentifier: string
  ): Promise<DriverWalletTransaction | null> {
    return await DriverWalletTransaction.query()
      .where('identifier', driverWalletTransactionIdentifier)
      .first()
  }

  public static async getDriverWalletTransaction(
    getDriverWalletTransactionOptions: DriverWalletTransactionIdentifierOptions
  ): Promise<DriverWalletTransaction | null> {
    const { identifier, identifierType } = getDriverWalletTransactionOptions

    const GetDriverWalletTransactionIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverWalletTransactionById(Number(identifier)),

      identifier: async () => await this.getDriverWalletTransactionByIdentifier(String(identifier)),
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
}
