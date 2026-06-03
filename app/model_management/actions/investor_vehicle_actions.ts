import type CreateInvestorVehicleRecordOptions from '#model_management/type_checking/investor_vehicle/create_investor_vehicle_record_options'
import type ListInvestorVehicleRecordsOptions from '#model_management/type_checking/investor_vehicle/list_investor_vehicle_records_options'
import type UpdateInvestorVehicleRecordOptions from '#model_management/type_checking/investor_vehicle/update_investor_vehicle_record_options'
import type InvestorVehicleIdentifierOptions from '#model_management/type_checking/investor_vehicle/investor_vehicle_identifier_options'
import InvestorVehicle from '#models/investor_vehicle'

export default class InvestorVehicleActions {
  public static async createInvestorVehicleRecord(
    createInvestorVehicleRecordOptions: CreateInvestorVehicleRecordOptions
  ): Promise<InvestorVehicle> {
    const { createPayload, dbTransactionOptions } = createInvestorVehicleRecordOptions

    const investorVehicle = new InvestorVehicle()
    Object.assign(investorVehicle, createPayload)

    if (dbTransactionOptions.useTransaction) {
      investorVehicle.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await investorVehicle.save()

    return investorVehicle
  }

  private static async getInvestorVehicleById(
    investorVehicleId: number
  ): Promise<InvestorVehicle | null> {
    return await InvestorVehicle.query().where('id', investorVehicleId).preload('investor').first()
  }

  private static async getInvestorVehicleByIdentifier(
    investorVehicleIdentifier: string
  ): Promise<InvestorVehicle | null> {
    return await InvestorVehicle.query()
      .where('identifier', investorVehicleIdentifier)
      .preload('investor')
      .first()
  }

  public static async getInvestorVehicle(
    getInvestorVehicleOptions: InvestorVehicleIdentifierOptions
  ): Promise<InvestorVehicle | null> {
    const { identifier, identifierType } = getInvestorVehicleOptions

    const GetInvestorVehicleIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getInvestorVehicleById(Number(identifier)),

      identifier: async () => await this.getInvestorVehicleByIdentifier(String(identifier)),
    }

    return await GetInvestorVehicleIdentifierOptions[identifierType]()
  }

  public static async updateInvestorVehicleRecord(
    updateInvestorVehicleRecordOptions: UpdateInvestorVehicleRecordOptions
  ): Promise<InvestorVehicle | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateInvestorVehicleRecordOptions

    const investorVehicle = await this.getInvestorVehicle(identifierOptions)

    if (investorVehicle === null) return null

    Object.assign(investorVehicle, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      investorVehicle.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await investorVehicle.save()

    return investorVehicle
  }

  public static async listInvestorVehicles(
    getInvestorVehicleRecordOptions: ListInvestorVehicleRecordsOptions
  ): Promise<{ investorVehiclePayload: InvestorVehicle[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getInvestorVehicleRecordOptions

    const investorVehicleQuery = InvestorVehicle.query().preload('investor')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `%${filterRecordOptionsPayload.searchQuery}%`

      investorVehicleQuery
        .whereILike('vehicle_name', searchValue)
        .orWhereILike('vehicle_type', searchValue)
        .orWhereILike('plate_number', searchValue)
    }

    if (filterRecordOptionsPayload?.investorId) {
      investorVehicleQuery.where('investor_id', filterRecordOptionsPayload.investorId)
    }

    if (paginationPayload) {
      const investorVehicles = await investorVehicleQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        investorVehiclePayload: investorVehicles.all(),
        paginationMeta: investorVehicles.getMeta(),
      }
    }

    const investorVehicles = await investorVehicleQuery.orderBy('created_at', 'desc')
    return {
      investorVehiclePayload: investorVehicles,
    }
  }

  public static async deleteInvestorVehicleRecord(
    identifierOptions: InvestorVehicleIdentifierOptions
  ): Promise<boolean> {
    const investorVehicle = await this.getInvestorVehicle(identifierOptions)

    if (investorVehicle === null) return false

    await investorVehicle.softDelete()
    return true
  }
}
