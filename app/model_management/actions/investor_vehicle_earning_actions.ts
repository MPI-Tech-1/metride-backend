import type CreateInvestorVehicleEarningRecordOptions from '#model_management/type_checking/investor_vehicle_earning/create_investor_vehicle_earning_record_options'
import type ListInvestorVehicleEarningRecordsOptions from '#model_management/type_checking/investor_vehicle_earning/list_investor_vehicle_earning_records_options'
import type InvestorVehicleEarningIdentifierOptions from '#model_management/type_checking/investor_vehicle_earning/investor_vehicle_earning_identifier_options'
import InvestorVehicleEarning from '#models/investor_vehicle_earning'
import { DateTime } from 'luxon'

export default class InvestorVehicleEarningActions {
  public static async createInvestorVehicleEarningRecord(
    createInvestorVehicleEarningRecordOptions: CreateInvestorVehicleEarningRecordOptions
  ): Promise<InvestorVehicleEarning> {
    const { createPayload, dbTransactionOptions } = createInvestorVehicleEarningRecordOptions

    const investorVehicleEarning = new InvestorVehicleEarning()
    Object.assign(investorVehicleEarning, createPayload)

    if (dbTransactionOptions.useTransaction) {
      investorVehicleEarning.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await investorVehicleEarning.save()

    return investorVehicleEarning
  }

  private static async getInvestorVehicleEarningById(
    investorVehicleEarningId: number
  ): Promise<InvestorVehicleEarning | null> {
    return await InvestorVehicleEarning.query()
      .where('id', investorVehicleEarningId)
      .preload('investorVehicle', (query) => {
        query.preload('investor').preload('rideType').preload('vehicleMake').preload('vehicleModel')
      })
      .first()
  }

  private static async getInvestorVehicleEarningByIdentifier(
    investorVehicleEarningIdentifier: string
  ): Promise<InvestorVehicleEarning | null> {
    return await InvestorVehicleEarning.query()
      .where('identifier', investorVehicleEarningIdentifier)
      .preload('investorVehicle', (query) => {
        query.preload('investor').preload('rideType').preload('vehicleMake').preload('vehicleModel')
      })
      .first()
  }

  public static async getInvestorVehicleEarning(
    getInvestorVehicleEarningOptions: InvestorVehicleEarningIdentifierOptions
  ): Promise<InvestorVehicleEarning | null> {
    const { identifier, identifierType } = getInvestorVehicleEarningOptions

    const GetInvestorVehicleEarningIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getInvestorVehicleEarningById(Number(identifier)),

      identifier: async () => await this.getInvestorVehicleEarningByIdentifier(String(identifier)),
    }

    return await GetInvestorVehicleEarningIdentifierOptions[identifierType]()
  }

  public static async listInvestorVehicleEarnings(
    getInvestorVehicleEarningRecordOptions: ListInvestorVehicleEarningRecordsOptions
  ): Promise<{
    investorVehicleEarningPayload: InvestorVehicleEarning[]
    paginationMeta?: any
  }> {
    const { filterRecordOptionsPayload, paginationPayload } = getInvestorVehicleEarningRecordOptions

    const investorVehicleEarningQuery = InvestorVehicleEarning.query().preload(
      'investorVehicle',
      (query) => {
        query.preload('investor').preload('rideType').preload('vehicleMake').preload('vehicleModel')
      }
    )

    if (filterRecordOptionsPayload?.status) {
      investorVehicleEarningQuery.where('status', filterRecordOptionsPayload.status)
    }

    if (filterRecordOptionsPayload?.investorVehicleId) {
      investorVehicleEarningQuery.where(
        'investor_vehicle_id',
        filterRecordOptionsPayload.investorVehicleId
      )
    }

    if (paginationPayload) {
      const investorVehicleEarnings = await investorVehicleEarningQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        investorVehicleEarningPayload: investorVehicleEarnings.all(),
        paginationMeta: investorVehicleEarnings.getMeta(),
      }
    }

    const investorVehicleEarnings = await investorVehicleEarningQuery.orderBy('created_at', 'desc')
    return {
      investorVehicleEarningPayload: investorVehicleEarnings,
    }
  }

  public static async payoutInvestorVehicleEarning(
    identifierOptions: InvestorVehicleEarningIdentifierOptions
  ): Promise<InvestorVehicleEarning | null> {
    const investorVehicleEarning = await this.getInvestorVehicleEarning(identifierOptions)

    if (investorVehicleEarning === null) return null

    if (investorVehicleEarning.status === 'paid') return investorVehicleEarning

    investorVehicleEarning.status = 'paid'
    investorVehicleEarning.paidAt = DateTime.now()
    await investorVehicleEarning.save()

    return investorVehicleEarning
  }
}
