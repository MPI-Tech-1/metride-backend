import type CreateDriverPersonalInformationRecordOptions from '#model_management/type_checking/driver_personal_information/create_driver_personal_information_record_options'
import type ListDriverPersonalInformationRecordsOptions from '#model_management/type_checking/driver_personal_information/list_driver_personal_information_records_options'
import type UpdateDriverPersonalInformationRecordOptions from '#model_management/type_checking/driver_personal_information/update_driver_personal_information_record_options'
import type DriverPersonalInformationIdentifierOptions from '#model_management/type_checking/driver_personal_information/driver_personal_information_identifier_options'
import DriverPersonalInformation from '#models/driver_personal_information'

export default class DriverPersonalInformationActions {
  public static async createDriverPersonalInformationRecord(
    createDriverPersonalInformationRecordOptions: CreateDriverPersonalInformationRecordOptions
  ): Promise<DriverPersonalInformation> {
    const { createPayload, dbTransactionOptions } = createDriverPersonalInformationRecordOptions

    const driverPersonalInformation = new DriverPersonalInformation()
    Object.assign(driverPersonalInformation, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverPersonalInformation.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverPersonalInformation.save()

    return driverPersonalInformation
  }

  private static async getDriverPersonalInformationById(
    driverPersonalInformationId: number
  ): Promise<DriverPersonalInformation | null> {
    return await DriverPersonalInformation.query()
      .preload('city')
      .where('id', driverPersonalInformationId)
      .first()
  }

  private static async getDriverPersonalInformationByDriverId(
    driverId: number
  ): Promise<DriverPersonalInformation | null> {
    return await DriverPersonalInformation.query()
      .preload('city')
      .where('driver_id', driverId)
      .first()
  }

  private static async getDriverPersonalInformationByIdentifier(
    driverPersonalInformationIdentifier: string
  ): Promise<DriverPersonalInformation | null> {
    return await DriverPersonalInformation.query()
      .preload('city')
      .where('identifier', driverPersonalInformationIdentifier)
      .first()
  }

  public static async getDriverPersonalInformation(
    getDriverPersonalInformationOptions: DriverPersonalInformationIdentifierOptions
  ): Promise<DriverPersonalInformation | null> {
    const { identifier, identifierType } = getDriverPersonalInformationOptions

    const GetDriverPersonalInformationIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverPersonalInformationById(Number(identifier)),

      identifier: async () =>
        await this.getDriverPersonalInformationByIdentifier(String(identifier)),

      driverId: async () => await this.getDriverPersonalInformationByDriverId(Number(identifier)),
    }

    return await GetDriverPersonalInformationIdentifierOptions[identifierType]()
  }

  public static async updateDriverPersonalInformationRecord(
    updateDriverPersonalInformationRecordOptions: UpdateDriverPersonalInformationRecordOptions
  ): Promise<DriverPersonalInformation | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverPersonalInformationRecordOptions

    const driverPersonalInformation = await this.getDriverPersonalInformation(identifierOptions)

    if (driverPersonalInformation === null) return null

    Object.assign(driverPersonalInformation, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverPersonalInformation.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverPersonalInformation.save()

    return driverPersonalInformation
  }

  public static async listDriverPersonalInformations(
    getDriverPersonalInformationRecordOptions: ListDriverPersonalInformationRecordsOptions
  ): Promise<{
    driverPersonalInformationPayload: DriverPersonalInformation[]
    paginationMeta?: any
  }> {
    const { filterRecordOptionsPayload, paginationPayload } =
      getDriverPersonalInformationRecordOptions

    const driverPersonalInformationQuery = DriverPersonalInformation.query().preload('city')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      driverPersonalInformationQuery
        .whereILike('identifier', searchValue)
        .orWhereILike('national_identification_number', searchValue)
        .orWhereILike('home_address', searchValue)
    }

    if (paginationPayload) {
      const driverPersonalInformations = await driverPersonalInformationQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverPersonalInformationPayload: driverPersonalInformations.all(),
        paginationMeta: driverPersonalInformations.getMeta(),
      }
    }

    const driverPersonalInformations = await driverPersonalInformationQuery.orderBy(
      'created_at',
      'desc'
    )
    return {
      driverPersonalInformationPayload: driverPersonalInformations,
    }
  }
}
