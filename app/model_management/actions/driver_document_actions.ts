import CreateDriverDocumentRecordOptions from '#model_management/type_checking/driver_document/create_driver_document_record_options'
import ListDriverDocumentRecordsOptions from '#model_management/type_checking/driver_document/list_driver_document_records_options'
import UpdateDriverDocumentRecordOptions from '#model_management/type_checking/driver_document/update_driver_document_record_options'
import DriverDocumentIdentifierOptions from '#model_management/type_checking/driver_document/driver_document_identifier_options'
import DriverDocument from '#models/driver_document'

export default class DriverDocumentActions {
  public static async createDriverDocumentRecord(
    createDriverDocumentRecordOptions: CreateDriverDocumentRecordOptions
  ): Promise<DriverDocument> {
    const { createPayload, dbTransactionOptions } = createDriverDocumentRecordOptions

    const driverDocument = new DriverDocument()
    Object.assign(driverDocument, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverDocument.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverDocument.save()

    return driverDocument
  }

  public static async getDriverDocumentById(
    driverDocumentId: number
  ): Promise<DriverDocument | null> {
    return await DriverDocument.query().where('id', driverDocumentId).first()
  }

  public static async getDriverDocumentByDriverId(
    driverId: number
  ): Promise<DriverDocument | null> {
    return await DriverDocument.query().where('driver_id', driverId).first()
  }

  public static async getDriverDocumentByIdentifier(
    driverDocumentIdentifier: string
  ): Promise<DriverDocument | null> {
    return await DriverDocument.query().where('identifier', driverDocumentIdentifier).first()
  }

  public static async getDriverDocument(
    getDriverDocumentOptions: DriverDocumentIdentifierOptions
  ): Promise<DriverDocument | null> {
    const { identifier, identifierType } = getDriverDocumentOptions

    const GetDriverDocumentIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverDocumentById(Number(identifier)),

      identifier: async () => await this.getDriverDocumentByIdentifier(String(identifier)),

      driverId: async () => await this.getDriverDocumentByDriverId(Number(identifier)),
    }

    return await GetDriverDocumentIdentifierOptions[identifierType]()
  }

  public static async updateDriverDocumentRecord(
    updateDriverDocumentRecordOptions: UpdateDriverDocumentRecordOptions
  ): Promise<DriverDocument | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverDocumentRecordOptions

    const driverDocument = await this.getDriverDocument(identifierOptions)

    if (driverDocument === null) return null

    Object.assign(driverDocument, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverDocument.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverDocument.save()

    return driverDocument
  }

  public static async listDriverDocuments(
    getDriverDocumentRecordOptions: ListDriverDocumentRecordsOptions
  ): Promise<{ driverDocumentPayload: DriverDocument[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getDriverDocumentRecordOptions

    const driverDocumentQuery = DriverDocument.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      driverDocumentQuery.whereILike('identifier', searchValue)
    }

    if (paginationPayload) {
      const driverDocuments = await driverDocumentQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverDocumentPayload: driverDocuments.all(),
        paginationMeta: driverDocuments.getMeta(),
      }
    }

    const driverDocuments = await driverDocumentQuery.orderBy('created_at', 'desc')
    return {
      driverDocumentPayload: driverDocuments,
    }
  }
}
