import type CreateCustomerWalletTransactionRecordOptions from '#model_management/type_checking/customer_wallet_transaction/create_customer_wallet_transaction_record_options'
import type ListCustomerWalletTransactionRecordsOptions from '#model_management/type_checking/customer_wallet_transaction/list_customer_wallet_transaction_records_options'
import type UpdateCustomerWalletTransactionRecordOptions from '#model_management/type_checking/customer_wallet_transaction/update_customer_wallet_transaction_record_options'
import type CustomerWalletTransactionIdentifierOptions from '#model_management/type_checking/customer_wallet_transaction/customer_wallet_transaction_identifier_options'
import CustomerWalletTransaction from '#models/customer_wallet_transaction'

export default class CustomerWalletTransactionActions {
  public static async createCustomerWalletTransactionRecord(
    createCustomerWalletTransactionRecordOptions: CreateCustomerWalletTransactionRecordOptions
  ): Promise<CustomerWalletTransaction> {
    const { createPayload, dbTransactionOptions } = createCustomerWalletTransactionRecordOptions

    const customerWalletTransaction = new CustomerWalletTransaction()
    Object.assign(customerWalletTransaction, createPayload)

    if (dbTransactionOptions.useTransaction) {
      customerWalletTransaction.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customerWalletTransaction.save()

    return customerWalletTransaction
  }

  public static async getCustomerWalletTransactionById(
    customerWalletTransactionId: number
  ): Promise<CustomerWalletTransaction | null> {
    return await CustomerWalletTransaction.query().where('id', customerWalletTransactionId).first()
  }

  public static async getCustomerWalletTransactionByIdentifier(
    customerWalletTransactionIdentifier: string
  ): Promise<CustomerWalletTransaction | null> {
    return await CustomerWalletTransaction.query()
      .where('identifier', customerWalletTransactionIdentifier)
      .first()
  }

  public static async getCustomerWalletTransaction(
    getCustomerWalletTransactionOptions: CustomerWalletTransactionIdentifierOptions
  ): Promise<CustomerWalletTransaction | null> {
    const { identifier, identifierType } = getCustomerWalletTransactionOptions

    const GetCustomerWalletTransactionIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getCustomerWalletTransactionById(Number(identifier)),

      identifier: async () =>
        await this.getCustomerWalletTransactionByIdentifier(String(identifier)),
    }

    return await GetCustomerWalletTransactionIdentifierOptions[identifierType]()
  }

  public static async updateCustomerWalletTransactionRecord(
    updateCustomerWalletTransactionRecordOptions: UpdateCustomerWalletTransactionRecordOptions
  ): Promise<CustomerWalletTransaction | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateCustomerWalletTransactionRecordOptions

    const customerWalletTransaction = await this.getCustomerWalletTransaction(identifierOptions)

    if (customerWalletTransaction === null) return null

    Object.assign(customerWalletTransaction, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      customerWalletTransaction.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customerWalletTransaction.save()

    return customerWalletTransaction
  }

  public static async listCustomerWalletTransactions(
    getCustomerWalletTransactionRecordOptions: ListCustomerWalletTransactionRecordsOptions
  ): Promise<{ customerWalletTransactionPayload: CustomerWalletTransaction[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } =
      getCustomerWalletTransactionRecordOptions

    const customerWalletTransactionQuery = CustomerWalletTransaction.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      // Add search logic if applicable
    }

    if (paginationPayload) {
      const customerWalletTransactions = await customerWalletTransactionQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload!.page, paginationPayload!.limit)

      return {
        customerWalletTransactionPayload: customerWalletTransactions.all(),
        paginationMeta: customerWalletTransactions.getMeta(),
      }
    }
    const customerWalletTransactions = await customerWalletTransactionQuery.orderBy(
      'created_at',
      'desc'
    )
    return {
      customerWalletTransactionPayload: customerWalletTransactions,
    }
  }
}
