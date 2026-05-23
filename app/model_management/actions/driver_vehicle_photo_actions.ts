import type CreateDriverVehiclePhotoRecordOptions from '#model_management/type_checking/driver_vehicle_photo/create_driver_vehicle_photo_record_options'
import type ListDriverVehiclePhotoRecordsOptions from '#model_management/type_checking/driver_vehicle_photo/list_driver_vehicle_photo_records_options'
import type UpdateDriverVehiclePhotoRecordOptions from '#model_management/type_checking/driver_vehicle_photo/update_driver_vehicle_photo_record_options'
import type DriverVehiclePhotoIdentifierOptions from '#model_management/type_checking/driver_vehicle_photo/driver_vehicle_photo_identifier_options'
import DriverVehiclePhoto from '#models/driver_vehicle_photo'
import DeleteDriverVehiclePhotoRecordOptions from '#model_management/type_checking/driver_vehicle_photo/delete_driver_vehicle_photo_record_options'

export default class DriverVehiclePhotoActions {
  public static async createDriverVehiclePhotoRecord(
    createDriverVehiclePhotoRecordOptions: CreateDriverVehiclePhotoRecordOptions
  ): Promise<DriverVehiclePhoto> {
    const { createPayload, dbTransactionOptions } = createDriverVehiclePhotoRecordOptions

    const driverVehiclePhoto = new DriverVehiclePhoto()
    Object.assign(driverVehiclePhoto, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverVehiclePhoto.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverVehiclePhoto.save()

    return driverVehiclePhoto
  }

  private static async getDriverVehiclePhotoById(id: number): Promise<DriverVehiclePhoto | null> {
    return await DriverVehiclePhoto.query().where('id', id).first()
  }

  private static async getDriverVehiclePhotoByIdentifier(
    identifier: string
  ): Promise<DriverVehiclePhoto | null> {
    return await DriverVehiclePhoto.query().where('identifier', identifier).first()
  }

  public static async getDriverVehiclePhoto(
    getDriverVehiclePhotoOptions: DriverVehiclePhotoIdentifierOptions
  ): Promise<DriverVehiclePhoto | null> {
    const { identifier, identifierType } = getDriverVehiclePhotoOptions

    const GetDriverVehiclePhotoIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverVehiclePhotoById(Number(identifier)),

      identifier: async () => await this.getDriverVehiclePhotoByIdentifier(String(identifier)),
    }

    return await GetDriverVehiclePhotoIdentifierOptions[identifierType]()
  }

  public static async updateDriverVehiclePhotoRecord(
    updateDriverVehiclePhotoRecordOptions: UpdateDriverVehiclePhotoRecordOptions
  ): Promise<DriverVehiclePhoto | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverVehiclePhotoRecordOptions

    const driverVehiclePhoto = await this.getDriverVehiclePhoto(identifierOptions)

    if (driverVehiclePhoto === null) return null

    Object.assign(driverVehiclePhoto, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverVehiclePhoto.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverVehiclePhoto.save()

    return driverVehiclePhoto
  }

  public static async deleteDriverVehiclePhotoRecord(
    deleteDriverVehiclePhotoRecordOptions: DeleteDriverVehiclePhotoRecordOptions
  ): Promise<void> {
    const { identifierOptions, dbTransactionOptions } = deleteDriverVehiclePhotoRecordOptions

    const driverVehiclePhoto = await this.getDriverVehiclePhoto(identifierOptions)

    if (driverVehiclePhoto === null) return

    if (dbTransactionOptions.useTransaction) {
      driverVehiclePhoto.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverVehiclePhoto.softDelete()
  }

  public static async listDriverVehiclePhotos(
    listDriverVehiclePhotoRecordsOptions: ListDriverVehiclePhotoRecordsOptions
  ): Promise<{ driverVehiclePhotoPayload: DriverVehiclePhoto[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = listDriverVehiclePhotoRecordsOptions

    const driverVehiclePhotoQuery = DriverVehiclePhoto.query()

    if (filterRecordOptionsPayload?.driverId) {
      driverVehiclePhotoQuery.where('driver_id', filterRecordOptionsPayload.driverId)
    }

    if (paginationPayload) {
      const driverVehiclePhotos = await driverVehiclePhotoQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverVehiclePhotoPayload: driverVehiclePhotos.all(),
        paginationMeta: driverVehiclePhotos.getMeta(),
      }
    }

    const driverVehiclePhotos = await driverVehiclePhotoQuery.orderBy('created_at', 'desc')
    return {
      driverVehiclePhotoPayload: driverVehiclePhotos,
    }
  }
}
