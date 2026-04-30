import type CreateCustomerWalletRecordOptions from '#model_management/type_checking/customer_wallet/create_customer_wallet_record_options'
import type ListCustomerWalletRecordsOptions from '#model_management/type_checking/customer_wallet/list_customer_wallet_records_options'
import type UpdateCustomerWalletRecordOptions from '#model_management/type_checking/customer_wallet/update_customer_wallet_record_options'
import type CustomerWalletIdentifierOptions from '#model_management/type_checking/customer_wallet/customer_wallet_identifier_options'
import CustomerWallet from '#models/customer_wallet'

export default class CustomerWalletActions {
  public static async createCustomerWalletRecord(
    createCustomerWalletRecordOptions: CreateCustomerWalletRecordOptions
  ): Promise<CustomerWallet> {
    const { createPayload, dbTransactionOptions } = createCustomerWalletRecordOptions

    const customerWallet = new CustomerWallet()
    Object.assign(customerWallet, createPayload)

    if (dbTransactionOptions.useTransaction) {
      customerWallet.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customerWallet.save()

    return customerWallet
  }

  public static async getCustomerWalletById(customerWalletId: number): Promise<CustomerWallet | null> {
    return await CustomerWallet.query().where('id', customerWalletId).first()
  }

  public static async getCustomerWalletByIdentifier(
    customerWalletIdentifier: string
  ): Promise<CustomerWallet | null> {
    return await CustomerWallet.query().where('identifier', customerWalletIdentifier).first()
  }

  public static async getCustomerWallet(
    getCustomerWalletOptions: CustomerWalletIdentifierOptions
  ): Promise<CustomerWallet | null> {
    const { identifier, identifierType } = getCustomerWalletOptions

    const GetCustomerWalletIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getCustomerWalletById(Number(identifier)),

      identifier: async () => await this.getCustomerWalletByIdentifier(String(identifier)),
    }

    return await GetCustomerWalletIdentifierOptions[identifierType]()
  }

  public static async updateCustomerWalletRecord(
    updateCustomerWalletRecordOptions: UpdateCustomerWalletRecordOptions
  ): Promise<CustomerWallet | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateCustomerWalletRecordOptions

    const customerWallet = await this.getCustomerWallet(identifierOptions)

    if (customerWallet === null) return null

    Object.assign(customerWallet, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      customerWallet.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customerWallet.save()

    return customerWallet
  }

  public static async listCustomerWallets(
    getCustomerWalletRecordOptions: ListCustomerWalletRecordsOptions
  ): Promise<{ customerWalletPayload: CustomerWallet[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getCustomerWalletRecordOptions

    const customerWalletQuery = CustomerWallet.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      // Add search logic if applicable
    }

    if (paginationPayload) {
      const customerWallets = await customerWalletQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload!.page, paginationPayload!.limit)

      return {
        customerWalletPayload: customerWallets.all(),
        paginationMeta: customerWallets.getMeta(),
      }
    }
    const customerWallets = await customerWalletQuery.orderBy('created_at', 'desc')
    return {
      customerWalletPayload: customerWallets,
    }
  }
}
