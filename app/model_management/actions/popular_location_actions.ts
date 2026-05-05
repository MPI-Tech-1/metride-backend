import type CreatePopularLocationRecordOptions from '#model_management/type_checking/popular_location/create_popular_location_record_options'
import type ListPopularLocationRecordsOptions from '#model_management/type_checking/popular_location/list_popular_location_records_options'
import type UpdatePopularLocationRecordOptions from '#model_management/type_checking/popular_location/update_popular_location_record_options'
import type PopularLocationIdentifierOptions from '#model_management/type_checking/popular_location/popular_location_identifier_options'
import PopularLocation from '#models/popular_location'

export default class PopularLocationActions {
  public static async createPopularLocationRecord(
    createPopularLocationRecordOptions: CreatePopularLocationRecordOptions
  ): Promise<PopularLocation> {
    const { createPayload, dbTransactionOptions } = createPopularLocationRecordOptions

    const popularLocation = new PopularLocation()
    Object.assign(popularLocation, createPayload)

    if (dbTransactionOptions.useTransaction) {
      popularLocation.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await popularLocation.save()

    return popularLocation
  }

  private static async getPopularLocationById(
    popularLocationId: number
  ): Promise<PopularLocation | null> {
    return await PopularLocation.query().where('id', popularLocationId).first()
  }

  private static async getPopularLocationByIdentifier(
    popularLocationIdentifier: string
  ): Promise<PopularLocation | null> {
    return await PopularLocation.query().where('identifier', popularLocationIdentifier).first()
  }

  public static async getPopularLocation(
    getPopularLocationOptions: PopularLocationIdentifierOptions
  ): Promise<PopularLocation | null> {
    const { identifier, identifierType } = getPopularLocationOptions

    const GetPopularLocationIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getPopularLocationById(Number(identifier)),

      identifier: async () => await this.getPopularLocationByIdentifier(String(identifier)),
    }

    return await GetPopularLocationIdentifierOptions[identifierType]()
  }

  public static async updatePopularLocationRecord(
    updatePopularLocationRecordOptions: UpdatePopularLocationRecordOptions
  ): Promise<PopularLocation | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updatePopularLocationRecordOptions

    const popularLocation = await this.getPopularLocation(identifierOptions)

    if (popularLocation === null) return null

    Object.assign(popularLocation, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      popularLocation.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await popularLocation.save()

    return popularLocation
  }

  public static async listPopularLocations(
    getPopularLocationRecordOptions: ListPopularLocationRecordsOptions
  ): Promise<{ popularLocationPayload: PopularLocation[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getPopularLocationRecordOptions

    const popularLocationQuery = PopularLocation.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      popularLocationQuery.whereILike('name', searchValue).orWhereILike('identifier', searchValue)
    }

    if (filterRecordOptionsPayload?.cityId) {
      popularLocationQuery.where('city_id', filterRecordOptionsPayload.cityId)
    }

    if (filterRecordOptionsPayload?.isActive !== undefined) {
      popularLocationQuery.where('is_active', filterRecordOptionsPayload.isActive)
    }

    if (filterRecordOptionsPayload?.typeOfLocation) {
      popularLocationQuery.where('type_of_location', filterRecordOptionsPayload.typeOfLocation)
    }

    if (paginationPayload) {
      const popularLocations = await popularLocationQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        popularLocationPayload: popularLocations.all(),
        paginationMeta: popularLocations.getMeta(),
      }
    }

    const popularLocations = await popularLocationQuery.orderBy('created_at', 'desc')
    return {
      popularLocationPayload: popularLocations,
    }
  }
}
