import type CreateDriverNotificationRecordOptions from '#model_management/type_checking/driver_notification/create_driver_notification_record_options'
import type ListDriverNotificationRecordsOptions from '#model_management/type_checking/driver_notification/list_driver_notification_records_options'
import type UpdateDriverNotificationRecordOptions from '#model_management/type_checking/driver_notification/update_driver_notification_record_options'
import type DriverNotificationIdentifierOptions from '#model_management/type_checking/driver_notification/driver_notification_identifier_options'
import DriverNotification from '#models/driver_notification'

export default class DriverNotificationActions {
  public static async createDriverNotificationRecord(
    createDriverNotificationRecordOptions: CreateDriverNotificationRecordOptions
  ): Promise<DriverNotification> {
    const { createPayload, dbTransactionOptions } = createDriverNotificationRecordOptions

    const driverNotification = new DriverNotification()
    Object.assign(driverNotification, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverNotification.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverNotification.save()

    return driverNotification
  }

  public static async getDriverNotificationById(
    driverNotificationId: number
  ): Promise<DriverNotification | null> {
    return await DriverNotification.query().where('id', driverNotificationId).first()
  }

  public static async getDriverNotificationByIdentifier(
    driverNotificationIdentifier: string
  ): Promise<DriverNotification | null> {
    return await DriverNotification.query().where('identifier', driverNotificationIdentifier).first()
  }

  public static async getDriverNotification(
    getDriverNotificationOptions: DriverNotificationIdentifierOptions
  ): Promise<DriverNotification | null> {
    const { identifier, identifierType } = getDriverNotificationOptions

    const GetDriverNotificationIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverNotificationById(Number(identifier)),

      identifier: async () => await this.getDriverNotificationByIdentifier(String(identifier)),
    }

    return await GetDriverNotificationIdentifierOptions[identifierType]()
  }

  public static async updateDriverNotificationRecord(
    updateDriverNotificationRecordOptions: UpdateDriverNotificationRecordOptions
  ): Promise<DriverNotification | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverNotificationRecordOptions

    const driverNotification = await this.getDriverNotification(identifierOptions)

    if (driverNotification === null) return null

    Object.assign(driverNotification, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverNotification.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverNotification.save()

    return driverNotification
  }

  public static async listDriverNotifications(
    getDriverNotificationRecordOptions: ListDriverNotificationRecordsOptions
  ): Promise<{ driverNotificationPayload: DriverNotification[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getDriverNotificationRecordOptions

    const driverNotificationQuery = DriverNotification.query()

    if (filterRecordOptionsPayload?.driverId) {
      driverNotificationQuery.where('driverId', filterRecordOptionsPayload.driverId)
    }

    if (filterRecordOptionsPayload?.isNotificationRead !== undefined) {
      driverNotificationQuery.where(
        'isNotificationRead',
        filterRecordOptionsPayload.isNotificationRead
      )
    }

    if (filterRecordOptionsPayload?.searchQuery) {
      driverNotificationQuery.whereILike('content', `%${filterRecordOptionsPayload.searchQuery}%`)
    }

    if (paginationPayload) {
      const driverNotifications = await driverNotificationQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload!.page, paginationPayload!.limit)

      return {
        driverNotificationPayload: driverNotifications.all(),
        paginationMeta: driverNotifications.getMeta(),
      }
    }
    const driverNotifications = await driverNotificationQuery.orderBy('created_at', 'desc')
    return {
      driverNotificationPayload: driverNotifications,
    }
  }
}
