import type CreateRideTypeRecordOptions from '#model_management/type_checking/ride_type/create_ride_type_record_options'
import type ListRideTypeRecordsOptions from '#model_management/type_checking/ride_type/list_ride_type_records_options'
import type UpdateRideTypeRecordOptions from '#model_management/type_checking/ride_type/update_ride_type_record_options'
import type RideTypeIdentifierOptions from '#model_management/type_checking/ride_type/ride_type_identifier_options'
import RideType from '#models/ride_type'

export default class RideTypeActions {
  public static async createRideTypeRecord(
    createRideTypeRecordOptions: CreateRideTypeRecordOptions
  ): Promise<RideType> {
    const { createPayload, dbTransactionOptions } = createRideTypeRecordOptions

    const rideType = new RideType()
    Object.assign(rideType, createPayload)

    if (dbTransactionOptions.useTransaction) {
      rideType.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await rideType.save()

    return rideType
  }

  public static async getRideTypeById(rideTypeId: number): Promise<RideType | null> {
    return await RideType.query().where('id', rideTypeId).first()
  }

  public static async getRideTypeByIdentifier(
    rideTypeIdentifier: string
  ): Promise<RideType | null> {
    return await RideType.query().where('identifier', rideTypeIdentifier).first()
  }

  public static async getRideType(
    getRideTypeOptions: RideTypeIdentifierOptions
  ): Promise<RideType | null> {
    const { identifier, identifierType } = getRideTypeOptions

    const GetRideTypeIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getRideTypeById(Number(identifier)),

      identifier: async () => await this.getRideTypeByIdentifier(String(identifier)),
    }

    return await GetRideTypeIdentifierOptions[identifierType]()
  }

  public static async updateRideTypeRecord(
    updateRideTypeRecordOptions: UpdateRideTypeRecordOptions
  ): Promise<RideType | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateRideTypeRecordOptions

    const rideType = await this.getRideType(identifierOptions)

    if (rideType === null) return null

    Object.assign(rideType, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      rideType.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await rideType.save()

    return rideType
  }

  public static async listRideTypes(
    getRideTypeRecordOptions: ListRideTypeRecordsOptions
  ): Promise<{ rideTypePayload: RideType[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getRideTypeRecordOptions

    const rideTypeQuery = RideType.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      rideTypeQuery.whereILike('name', searchValue).orWhereILike('identifier', searchValue)
    }

    if (paginationPayload) {
      const rideTypes = await rideTypeQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        rideTypePayload: rideTypes.all(),
        paginationMeta: rideTypes.getMeta(),
      }
    }

    const rideTypes = await rideTypeQuery.orderBy('created_at', 'desc')
    return {
      rideTypePayload: rideTypes,
    }
  }
}
