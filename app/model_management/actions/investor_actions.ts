import type CreateInvestorRecordOptions from '#model_management/type_checking/investor/create_investor_record_options'
import type ListInvestorRecordsOptions from '#model_management/type_checking/investor/list_investor_records_options'
import type UpdateInvestorRecordOptions from '#model_management/type_checking/investor/update_investor_record_options'
import type InvestorIdentifierOptions from '#model_management/type_checking/investor/investor_identifier_options'
import Investor from '#models/investor'

export default class InvestorActions {
  public static async createInvestorRecord(
    createInvestorRecordOptions: CreateInvestorRecordOptions
  ): Promise<Investor> {
    const { createPayload, dbTransactionOptions } = createInvestorRecordOptions

    const investor = new Investor()
    Object.assign(investor, createPayload)

    if (dbTransactionOptions.useTransaction) {
      investor.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await investor.save()

    return investor
  }

  private static async getInvestorById(investorId: number): Promise<Investor | null> {
    return await Investor.query().where('id', investorId).first()
  }

  private static async getInvestorByIdentifier(
    investorIdentifier: string
  ): Promise<Investor | null> {
    return await Investor.query().where('identifier', investorIdentifier).first()
  }

  public static async getInvestor(
    getInvestorOptions: InvestorIdentifierOptions
  ): Promise<Investor | null> {
    const { identifier, identifierType } = getInvestorOptions

    const GetInvestorIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getInvestorById(Number(identifier)),

      identifier: async () => await this.getInvestorByIdentifier(String(identifier)),
    }

    return await GetInvestorIdentifierOptions[identifierType]()
  }

  public static async updateInvestorRecord(
    updateInvestorRecordOptions: UpdateInvestorRecordOptions
  ): Promise<Investor | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateInvestorRecordOptions

    const investor = await this.getInvestor(identifierOptions)

    if (investor === null) return null

    Object.assign(investor, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      investor.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await investor.save()

    return investor
  }

  public static async listInvestors(
    getInvestorRecordOptions: ListInvestorRecordsOptions
  ): Promise<{ investorPayload: Investor[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getInvestorRecordOptions

    const investorQuery = Investor.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `%${filterRecordOptionsPayload.searchQuery}%`

      investorQuery
        .whereILike('first_name', searchValue)
        .orWhereILike('last_name', searchValue)
        .orWhereILike('email', searchValue)
        .orWhereILike('mobile_number', searchValue)
    }

    if (paginationPayload) {
      const investors = await investorQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        investorPayload: investors.all(),
        paginationMeta: investors.getMeta(),
      }
    }

    const investors = await investorQuery.orderBy('created_at', 'desc')
    return {
      investorPayload: investors,
    }
  }
}
