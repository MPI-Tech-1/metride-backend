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
    return await InvestorVehicle.query()
      .where('id', investorVehicleId)
      .preload('investor')
      .preload('rideType')
      .preload('vehicleMake')
      .preload('vehicleModel')
      .first()
  }

  private static async getInvestorVehicleByIdentifier(
    investorVehicleIdentifier: string
  ): Promise<InvestorVehicle | null> {
    return await InvestorVehicle.query()
      .where('identifier', investorVehicleIdentifier)
      .preload('investor')
      .preload('rideType')
      .preload('vehicleMake')
      .preload('vehicleModel')
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

    const investorVehicleQuery = InvestorVehicle.query()
      .preload('investor')
      .preload('rideType')
      .preload('vehicleMake')
      .preload('vehicleModel')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `%${filterRecordOptionsPayload.searchQuery}%`

      investorVehicleQuery.where((query) => {
        query
          .whereILike('plate_number', searchValue)
          .orWhereILike('color_of_vehicle', searchValue)
          .orWhereHas('investor', (investorQuery) => {
            investorQuery
              .whereILike('first_name', searchValue)
              .orWhereILike('last_name', searchValue)
          })
          .orWhereHas('rideType', (rideTypeQuery) => {
            rideTypeQuery.whereILike('name', searchValue)
          })
          .orWhereHas('vehicleMake', (vehicleMakeQuery) => {
            vehicleMakeQuery.whereILike('name', searchValue)
          })
          .orWhereHas('vehicleModel', (vehicleModelQuery) => {
            vehicleModelQuery.whereILike('name', searchValue)
          })
      })
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
  ): Promise<void> {
    const investorVehicle = await this.getInvestorVehicle(identifierOptions)

    if (investorVehicle === null) return

    await investorVehicle.softDelete()
  }
}
