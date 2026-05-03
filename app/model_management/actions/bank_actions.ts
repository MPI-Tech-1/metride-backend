import type CreateBankRecordOptions from '#model_management/type_checking/bank/create_bank_record_options'
import type ListBankRecordsOptions from '#model_management/type_checking/bank/list_bank_records_options'
import type UpdateBankRecordOptions from '#model_management/type_checking/bank/update_bank_record_options'
import type BankIdentifierOptions from '#model_management/type_checking/bank/bank_identifier_options'
import Bank from '#models/bank'

export default class BankActions {
  public static async createBankRecord(
    createBankRecordOptions: CreateBankRecordOptions
  ): Promise<Bank> {
    const { createPayload, dbTransactionOptions } = createBankRecordOptions

    const bank = new Bank()
    Object.assign(bank, createPayload)

    if (dbTransactionOptions.useTransaction) {
      bank.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await bank.save()

    return bank
  }

  private static async getBankById(bankId: number): Promise<Bank | null> {
    return await Bank.query().where('id', bankId).first()
  }

  private static async getBankByIdentifier(bankIdentifier: string): Promise<Bank | null> {
    return await Bank.query().where('identifier', bankIdentifier).first()
  }

  public static async getBank(getBankOptions: BankIdentifierOptions): Promise<Bank | null> {
    const { identifier, identifierType } = getBankOptions

    const GetBankIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getBankById(Number(identifier)),

      identifier: async () => await this.getBankByIdentifier(String(identifier)),
    }

    return await GetBankIdentifierOptions[identifierType]()
  }

  public static async updateBankRecord(
    updateBankRecordOptions: UpdateBankRecordOptions
  ): Promise<Bank | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateBankRecordOptions

    const bank = await this.getBank(identifierOptions)

    if (bank === null) return null

    Object.assign(bank, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      bank.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await bank.save()

    return bank
  }

  public static async listBanks(
    getBankRecordOptions: ListBankRecordsOptions
  ): Promise<{ bankPayload: Bank[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getBankRecordOptions

    const bankQuery = Bank.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      bankQuery.whereILike('name', searchValue).orWhereILike('identifier', searchValue)
    }

    if (paginationPayload) {
      const banks = await bankQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        bankPayload: banks.all(),
        paginationMeta: banks.getMeta(),
      }
    }

    const banks = await bankQuery.orderBy('created_at', 'desc')
    return {
      bankPayload: banks,
    }
  }
}
