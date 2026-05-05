import type CreateDriverWalletRecordOptions from '#model_management/type_checking/driver_wallet/create_driver_wallet_record_options'
import type ListDriverWalletRecordsOptions from '#model_management/type_checking/driver_wallet/list_driver_wallet_records_options'
import type UpdateDriverWalletRecordOptions from '#model_management/type_checking/driver_wallet/update_driver_wallet_record_options'
import type DriverWalletIdentifierOptions from '#model_management/type_checking/driver_wallet/driver_wallet_identifier_options'
import DriverWallet from '#models/driver_wallet'
import type DbTransactionOptions from '#common/type_checkings/model_management/db_transaction_options'

export default class DriverWalletActions {
  public static async createDriverWalletRecord(
    createDriverWalletRecordOptions: CreateDriverWalletRecordOptions
  ): Promise<DriverWallet> {
    const { createPayload, dbTransactionOptions } = createDriverWalletRecordOptions

    const driverWallet = new DriverWallet()
    Object.assign(driverWallet, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverWallet.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverWallet.save()

    return driverWallet
  }

  private static async getDriverWalletById(
    driverWalletId: number,
    dbTransactionOptions?: DbTransactionOptions
  ): Promise<DriverWallet | null> {
    const driverQuery = DriverWallet.query().where('id', driverWalletId)
    if (dbTransactionOptions?.useTransaction) {
      driverQuery.forUpdate()
      driverQuery.useTransaction(dbTransactionOptions.dbTransaction)
    }
    return await driverQuery.first()
  }

  private static async getDriverWalletByDriverId(
    driverId: number,
    dbTransactionOptions?: DbTransactionOptions
  ): Promise<DriverWallet | null> {
    const driverQuery = DriverWallet.query().where('driver_id', driverId)
    if (dbTransactionOptions?.useTransaction) {
      driverQuery.forUpdate()
      driverQuery.useTransaction(dbTransactionOptions.dbTransaction)
    }
    return await driverQuery.first()
  }

  private static async getDriverWalletByIdentifier(
    driverWalletIdentifier: string,
    dbTransactionOptions?: DbTransactionOptions
  ): Promise<DriverWallet | null> {
    const driverQuery = DriverWallet.query().where('identifier', driverWalletIdentifier)
    if (dbTransactionOptions?.useTransaction) {
      driverQuery.forUpdate()
      driverQuery.useTransaction(dbTransactionOptions.dbTransaction)
    }
    return await driverQuery.first()
  }

  public static async getDriverWallet(
    getDriverWalletOptions: DriverWalletIdentifierOptions
  ): Promise<DriverWallet | null> {
    const { identifier, identifierType, dbTransactionOptions } = getDriverWalletOptions

    const GetDriverWalletIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverWalletById(Number(identifier), dbTransactionOptions),

      driverId: async () =>
        await this.getDriverWalletByDriverId(Number(identifier), dbTransactionOptions),

      identifier: async () =>
        await this.getDriverWalletByIdentifier(String(identifier), dbTransactionOptions),
    }

    return await GetDriverWalletIdentifierOptions[identifierType]()
  }

  public static async updateDriverWalletRecord(
    updateDriverWalletRecordOptions: UpdateDriverWalletRecordOptions
  ): Promise<DriverWallet | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverWalletRecordOptions

    const driverWallet = await this.getDriverWallet(identifierOptions)

    if (driverWallet === null) return null

    Object.assign(driverWallet, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverWallet.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverWallet.save()

    return driverWallet
  }

  public static async listDriverWallets(
    getDriverWalletRecordOptions: ListDriverWalletRecordsOptions
  ): Promise<{ driverWalletPayload: DriverWallet[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getDriverWalletRecordOptions

    const driverWalletQuery = DriverWallet.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      // Add search logic if applicable
    }

    if (paginationPayload) {
      const driverWallets = await driverWalletQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload!.page, paginationPayload!.limit)

      return {
        driverWalletPayload: driverWallets.all(),
        paginationMeta: driverWallets.getMeta(),
      }
    }
    const driverWallets = await driverWalletQuery.orderBy('created_at', 'desc')
    return {
      driverWalletPayload: driverWallets,
    }
  }
}
