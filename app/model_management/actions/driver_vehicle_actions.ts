import type CreateDriverVehicleRecordOptions from '#model_management/type_checking/driver_vehicle/create_driver_vehicle_record_options'
import type ListDriverVehicleRecordsOptions from '#model_management/type_checking/driver_vehicle/list_driver_vehicle_records_options'
import type UpdateDriverVehicleRecordOptions from '#model_management/type_checking/driver_vehicle/update_driver_vehicle_record_options'
import type DriverVehicleIdentifierOptions from '#model_management/type_checking/driver_vehicle/driver_vehicle_identifier_options'
import DriverVehicle from '#models/driver_vehicle'

export default class DriverVehicleActions {
  public static async createDriverVehicleRecord(
    createDriverVehicleRecordOptions: CreateDriverVehicleRecordOptions
  ): Promise<DriverVehicle> {
    const { createPayload, dbTransactionOptions } = createDriverVehicleRecordOptions

    const driverVehicle = new DriverVehicle()
    Object.assign(driverVehicle, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverVehicle.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverVehicle.save()

    return driverVehicle
  }

  private static async getDriverVehicleById(
    driverVehicleId: number
  ): Promise<DriverVehicle | null> {
    return await DriverVehicle.query()
      .preload('vehicleMake')
      .preload('vehicleModel')
      .where('id', driverVehicleId)
      .first()
  }

  private static async getDriverVehicleByDriverId(driverId: number): Promise<DriverVehicle | null> {
    return await DriverVehicle.query()
      .preload('vehicleMake')
      .preload('vehicleModel')
      .where('driver_id', driverId)
      .first()
  }

  private static async getDriverVehicleByIdentifier(
    driverVehicleIdentifier: string
  ): Promise<DriverVehicle | null> {
    return await DriverVehicle.query()
      .preload('vehicleMake')
      .preload('vehicleModel')
      .where('identifier', driverVehicleIdentifier)
      .first()
  }

  public static async getDriverVehicle(
    getDriverVehicleOptions: DriverVehicleIdentifierOptions
  ): Promise<DriverVehicle | null> {
    const { identifier, identifierType } = getDriverVehicleOptions

    const GetDriverVehicleIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverVehicleById(Number(identifier)),

      identifier: async () => await this.getDriverVehicleByIdentifier(String(identifier)),

      driverId: async () => await this.getDriverVehicleByDriverId(Number(identifier)),
    }

    return await GetDriverVehicleIdentifierOptions[identifierType]()
  }

  public static async updateDriverVehicleRecord(
    updateDriverVehicleRecordOptions: UpdateDriverVehicleRecordOptions
  ): Promise<DriverVehicle | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverVehicleRecordOptions

    const driverVehicle = await this.getDriverVehicle(identifierOptions)

    if (driverVehicle === null) return null

    Object.assign(driverVehicle, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverVehicle.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverVehicle.save()

    return driverVehicle
  }

  public static async listDriverVehicles(
    getDriverVehicleRecordOptions: ListDriverVehicleRecordsOptions
  ): Promise<{ driverVehiclePayload: DriverVehicle[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getDriverVehicleRecordOptions

    const driverVehicleQuery = DriverVehicle.query().preload('vehicleMake').preload('vehicleModel')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      driverVehicleQuery
        .whereILike('identifier', searchValue)
        .orWhereILike('plate_number', searchValue)
    }

    if (paginationPayload) {
      const driverVehicles = await driverVehicleQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverVehiclePayload: driverVehicles.all(),
        paginationMeta: driverVehicles.getMeta(),
      }
    }

    const driverVehicles = await driverVehicleQuery.orderBy('created_at', 'desc')
    return {
      driverVehiclePayload: driverVehicles,
    }
  }
}
