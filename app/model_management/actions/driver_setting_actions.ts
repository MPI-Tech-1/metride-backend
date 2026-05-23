import type CreateDriverSettingRecordOptions from '#model_management/type_checking/driver_setting/create_driver_setting_record_options'
import type ListDriverSettingRecordsOptions from '#model_management/type_checking/driver_setting/list_driver_setting_records_options'
import type UpdateDriverSettingRecordOptions from '#model_management/type_checking/driver_setting/update_driver_setting_record_options'
import type DriverSettingIdentifierOptions from '#model_management/type_checking/driver_setting/driver_setting_identifier_options'
import DriverSetting from '#models/driver_setting'

export default class DriverSettingActions {
  public static async createDriverSettingRecord(
    createDriverSettingRecordOptions: CreateDriverSettingRecordOptions
  ): Promise<DriverSetting> {
    const { createPayload, dbTransactionOptions } = createDriverSettingRecordOptions

    const driverSetting = new DriverSetting()
    Object.assign(driverSetting, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverSetting.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverSetting.save()

    return driverSetting
  }

  private static async getDriverSettingById(
    driverSettingId: number
  ): Promise<DriverSetting | null> {
    return await DriverSetting.query().where('id', driverSettingId).first()
  }

  private static async getDriverSettingByIdentifier(
    driverSettingIdentifier: string
  ): Promise<DriverSetting | null> {
    return await DriverSetting.query().where('identifier', driverSettingIdentifier).first()
  }

  private static async getDriverSettingByDriverId(driverId: number): Promise<DriverSetting | null> {
    return await DriverSetting.query()
      .where('driver_id', driverId)
      .orderBy('created_at', 'desc')
      .first()
  }

  public static async getDriverSetting(
    getDriverSettingOptions: DriverSettingIdentifierOptions
  ): Promise<DriverSetting | null> {
    const { identifier, identifierType } = getDriverSettingOptions

    const GetDriverSettingIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverSettingById(Number(identifier)),
      identifier: async () => await this.getDriverSettingByIdentifier(String(identifier)),
      driverId: async () => await this.getDriverSettingByDriverId(Number(identifier)),
    }

    return await GetDriverSettingIdentifierOptions[identifierType]()
  }

  public static async updateDriverSettingRecord(
    updateDriverSettingRecordOptions: UpdateDriverSettingRecordOptions
  ): Promise<DriverSetting | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverSettingRecordOptions

    const driverSetting = await this.getDriverSetting(identifierOptions)

    if (driverSetting === null) return null

    Object.assign(driverSetting, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverSetting.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverSetting.save()

    return driverSetting
  }

  public static async listDriverSettings(
    listDriverSettingRecordsOptions: ListDriverSettingRecordsOptions
  ): Promise<{ driverSettingPayload: DriverSetting[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = listDriverSettingRecordsOptions

    const driverSettingQuery = DriverSetting.query()

    if (filterRecordOptionsPayload?.driverId) {
      driverSettingQuery.where('driver_id', filterRecordOptionsPayload.driverId)
    }

    if (paginationPayload) {
      const driverSettings = await driverSettingQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverSettingPayload: driverSettings.all(),
        paginationMeta: driverSettings.getMeta(),
      }
    }

    const driverSettings = await driverSettingQuery.orderBy('created_at', 'desc')
    return {
      driverSettingPayload: driverSettings,
    }
  }
}
