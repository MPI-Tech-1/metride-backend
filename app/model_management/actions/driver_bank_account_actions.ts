import CreateDriverBankAccountRecordOptions from '#model_management/type_checking/driver_bank_account/create_driver_bank_account_record_options'
import ListDriverBankAccountRecordsOptions from '#model_management/type_checking/driver_bank_account/list_driver_bank_account_records_options'
import UpdateDriverBankAccountRecordOptions from '#model_management/type_checking/driver_bank_account/update_driver_bank_account_record_options'
import DriverBankAccountIdentifierOptions from '#model_management/type_checking/driver_bank_account/driver_bank_account_identifier_options'
import DriverBankAccount from '#models/driver_bank_account'

export default class DriverBankAccountActions {
  public static async createDriverBankAccountRecord(
    createDriverBankAccountRecordOptions: CreateDriverBankAccountRecordOptions
  ): Promise<DriverBankAccount> {
    const { createPayload, dbTransactionOptions } = createDriverBankAccountRecordOptions

    const driverBankAccount = new DriverBankAccount()
    Object.assign(driverBankAccount, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverBankAccount.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverBankAccount.save()

    return driverBankAccount
  }

  public static async getDriverBankAccountById(
    driverBankAccountId: number
  ): Promise<DriverBankAccount | null> {
    return await DriverBankAccount.query().where('id', driverBankAccountId).first()
  }

  public static async getDriverBankAccountByDriverId(
    driverId: number
  ): Promise<DriverBankAccount | null> {
    return await DriverBankAccount.query().where('driver_id', driverId).first()
  }

  public static async getDriverBankAccountByIdentifier(
    driverBankAccountIdentifier: string
  ): Promise<DriverBankAccount | null> {
    return await DriverBankAccount.query().where('identifier', driverBankAccountIdentifier).first()
  }

  public static async getDriverBankAccount(
    getDriverBankAccountOptions: DriverBankAccountIdentifierOptions
  ): Promise<DriverBankAccount | null> {
    const { identifier, identifierType } = getDriverBankAccountOptions

    const GetDriverBankAccountIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverBankAccountById(Number(identifier)),

      identifier: async () => await this.getDriverBankAccountByIdentifier(String(identifier)),

      driverId: async () => await this.getDriverBankAccountByDriverId(Number(identifier)),
    }

    return await GetDriverBankAccountIdentifierOptions[identifierType]()
  }

  public static async updateDriverBankAccountRecord(
    updateDriverBankAccountRecordOptions: UpdateDriverBankAccountRecordOptions
  ): Promise<DriverBankAccount | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverBankAccountRecordOptions

    const driverBankAccount = await this.getDriverBankAccount(identifierOptions)

    if (driverBankAccount === null) return null

    Object.assign(driverBankAccount, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverBankAccount.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverBankAccount.save()

    return driverBankAccount
  }

  public static async listDriverBankAccounts(
    getDriverBankAccountRecordOptions: ListDriverBankAccountRecordsOptions
  ): Promise<{ driverBankAccountPayload: DriverBankAccount[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getDriverBankAccountRecordOptions

    const driverBankAccountQuery = DriverBankAccount.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      driverBankAccountQuery
        .whereILike('account_name', searchValue)
        .orWhereILike('account_number', searchValue)
    }

    if (paginationPayload) {
      const driverBankAccounts = await driverBankAccountQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverBankAccountPayload: driverBankAccounts.all(),
        paginationMeta: driverBankAccounts.getMeta(),
      }
    }

    const driverBankAccounts = await driverBankAccountQuery.orderBy('created_at', 'desc')
    return {
      driverBankAccountPayload: driverBankAccounts,
    }
  }
}
