import type CreateDriverWalletRecordOptions from '#model_management/type_checking/driver_wallet/create_driver_wallet_record_options'
import type ListDriverWalletRecordsOptions from '#model_management/type_checking/driver_wallet/list_driver_wallet_records_options'
import type UpdateDriverWalletRecordOptions from '#model_management/type_checking/driver_wallet/update_driver_wallet_record_options'
import type DriverWalletIdentifierOptions from '#model_management/type_checking/driver_wallet/driver_wallet_identifier_options'
import DriverWallet from '#models/driver_wallet'

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

  private static async getDriverWalletById(driverWalletId: number): Promise<DriverWallet | null> {
    return await DriverWallet.query().where('id', driverWalletId).first()
  }

  private static async getDriverWalletByDriverId(driverId: number): Promise<DriverWallet | null> {
    return await DriverWallet.query().where('driver_id', driverId).first()
  }

  private static async getDriverWalletByIdentifier(
    driverWalletIdentifier: string
  ): Promise<DriverWallet | null> {
    return await DriverWallet.query().where('identifier', driverWalletIdentifier).first()
  }

  public static async getDriverWallet(
    getDriverWalletOptions: DriverWalletIdentifierOptions
  ): Promise<DriverWallet | null> {
    const { identifier, identifierType } = getDriverWalletOptions

    const GetDriverWalletIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverWalletById(Number(identifier)),

      driverId: async () => await this.getDriverWalletByDriverId(Number(identifier)),

      identifier: async () => await this.getDriverWalletByIdentifier(String(identifier)),
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
