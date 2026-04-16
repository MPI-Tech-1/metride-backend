import CreateCityRecordOptions from '#model_management/type_checking/city/create_city_record_options'
import ListCityRecordsOptions from '#model_management/type_checking/city/list_city_records_options'
import UpdateCityRecordOptions from '#model_management/type_checking/city/update_city_record_options'
import CityIdentifierOptions from '#model_management/type_checking/city/city_identifier_options'
import City from '#models/city'

export default class CityActions {
  public static async createCityRecord(
    createCityRecordOptions: CreateCityRecordOptions
  ): Promise<City> {
    const { createPayload, dbTransactionOptions } = createCityRecordOptions

    const city = new City()
    Object.assign(city, createPayload)

    if (dbTransactionOptions.useTransaction) {
      city.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await city.save()

    return city
  }

  public static async getCityById(cityId: number): Promise<City | null> {
    return await City.query().where('id', cityId).first()
  }

  public static async getCityByIdentifier(cityIdentifier: string): Promise<City | null> {
    return await City.query().where('identifier', cityIdentifier).first()
  }

  public static async getCity(getCityOptions: CityIdentifierOptions): Promise<City | null> {
    const { identifier, identifierType } = getCityOptions

    const GetCityIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getCityById(Number(identifier)),

      identifier: async () => await this.getCityByIdentifier(String(identifier)),
    }

    return await GetCityIdentifierOptions[identifierType]()
  }

  public static async updateCityRecord(
    updateCityRecordOptions: UpdateCityRecordOptions
  ): Promise<City | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateCityRecordOptions

    const city = await this.getCity(identifierOptions)

    if (city === null) return null

    Object.assign(city, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      city.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await city.save()

    return city
  }

  public static async listCities(
    getCityRecordOptions: ListCityRecordsOptions
  ): Promise<{ cityPayload: City[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getCityRecordOptions

    const cityQuery = City.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      cityQuery.whereILike('name', searchValue).orWhereILike('identifier', searchValue)
    }

    if (paginationPayload) {
      const cities = await cityQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        cityPayload: cities.all(),
        paginationMeta: cities.getMeta(),
      }
    }

    const cities = await cityQuery.orderBy('created_at', 'desc')
    return {
      cityPayload: cities,
    }
  }
}
