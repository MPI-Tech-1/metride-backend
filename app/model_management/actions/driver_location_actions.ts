import type CreateDriverLocationRecordOptions from '#model_management/type_checking/driver_location/create_driver_location_record_options'
import type ListDriverLocationRecordsOptions from '#model_management/type_checking/driver_location/list_driver_location_records_options'
import type UpdateDriverLocationRecordOptions from '#model_management/type_checking/driver_location/update_driver_location_record_options'
import type DriverLocationIdentifierOptions from '#model_management/type_checking/driver_location/driver_location_identifier_options'
import DriverLocation from '#models/driver_location'

export default class DriverLocationActions {
  public static async createDriverLocationRecord(
    createDriverLocationRecordOptions: CreateDriverLocationRecordOptions
  ): Promise<DriverLocation> {
    const { createPayload, dbTransactionOptions } = createDriverLocationRecordOptions

    const driverLocation = new DriverLocation()
    Object.assign(driverLocation, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverLocation.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverLocation.save()

    return driverLocation
  }

  private static async getDriverLocationById(
    driverLocationId: number
  ): Promise<DriverLocation | null> {
    return await DriverLocation.query().where('id', driverLocationId).first()
  }

  private static async getDriverLocationByIdentifier(
    driverLocationIdentifier: string
  ): Promise<DriverLocation | null> {
    return await DriverLocation.query()
      .where('identifier', driverLocationIdentifier)
      .first()
  }

  private static async getDriverLocationByDriverId(
    driverId: number
  ): Promise<DriverLocation | null> {
    return await DriverLocation.query()
      .where('driver_id', driverId)
      .orderBy('created_at', 'desc')
      .first()
  }

  public static async getDriverLocation(
    getDriverLocationOptions: DriverLocationIdentifierOptions
  ): Promise<DriverLocation | null> {
    const { identifier, identifierType } = getDriverLocationOptions

    const GetDriverLocationIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverLocationById(Number(identifier)),
      identifier: async () => await this.getDriverLocationByIdentifier(String(identifier)),
      driverId: async () => await this.getDriverLocationByDriverId(Number(identifier)),
    }

    return await GetDriverLocationIdentifierOptions[identifierType]()
  }

  public static async updateDriverLocationRecord(
    updateDriverLocationRecordOptions: UpdateDriverLocationRecordOptions
  ): Promise<DriverLocation | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverLocationRecordOptions

    const driverLocation = await this.getDriverLocation(identifierOptions)

    if (driverLocation === null) return null

    Object.assign(driverLocation, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverLocation.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverLocation.save()

    return driverLocation
  }

  public static async listDriverLocations(
    listDriverLocationRecordsOptions: ListDriverLocationRecordsOptions
  ): Promise<{ driverLocationPayload: DriverLocation[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = listDriverLocationRecordsOptions

    const driverLocationQuery = DriverLocation.query()

    if (filterRecordOptionsPayload?.driverId) {
      driverLocationQuery.where('driver_id', filterRecordOptionsPayload.driverId)
    }

    if (paginationPayload) {
      const driverLocations = await driverLocationQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverLocationPayload: driverLocations.all(),
        paginationMeta: driverLocations.getMeta(),
      }
    }

    const driverLocations = await driverLocationQuery.orderBy('created_at', 'desc')
    return {
      driverLocationPayload: driverLocations,
    }
  }
}
