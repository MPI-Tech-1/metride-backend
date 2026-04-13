import CreateCustomerRecordOptions from '#model_management/type_checking/customer/create_customer_record_options'
import ListCustomerRecordsOptions from '#model_management/type_checking/customer/list_customer_records_options'
import UpdateCustomerRecordOptions from '#model_management/type_checking/customer/update_customer_record_options'
import CustomerIdentifierOptions from '#model_management/type_checking/customer/customer_identifier_options'
import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'

export default class CustomerActions {
  public static async createCustomerRecord(
    createCustomerRecordOptions: CreateCustomerRecordOptions
  ): Promise<Customer> {
    const { createPayload, dbTransactionOptions } = createCustomerRecordOptions

    const customer = new Customer()
    Object.assign(customer, createPayload)

    if (dbTransactionOptions.useTransaction) {
      customer.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customer.save()

    return customer
  }

  public static async getCustomerByEmail(email: string): Promise<Customer | null> {
    return await Customer.query().where('email', email).first()
  }

  public static async getCustomerById(customerId: number): Promise<Customer | null> {
    return await Customer.query().where('id', customerId).first()
  }

  public static async getCustomerByIdentifier(
    customerIdentifier: string
  ): Promise<Customer | null> {
    return await Customer.query().where('identifier', customerIdentifier).first()
  }

  public static async getCustomer(
    getCustomerOptions: CustomerIdentifierOptions
  ): Promise<Customer | null> {
    const { identifier, identifierType } = getCustomerOptions

    const GetCustomerIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getCustomerById(Number(identifier)),

      identifier: async () => await this.getCustomerByIdentifier(String(identifier)),

      email: async () => await this.getCustomerByEmail(String(identifier)),
    }

    return await GetCustomerIdentifierOptions[identifierType]()
  }

  public static async updateCustomerRecord(
    updateCustomerRecordOptions: UpdateCustomerRecordOptions
  ): Promise<Customer | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateCustomerRecordOptions

    const customer = await this.getCustomer(identifierOptions)

    if (customer === null) return null

    Object.assign(customer, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      customer.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customer.save()

    return customer
  }

  public static async listCustomers(
    getCustomerRecordOptions: ListCustomerRecordsOptions
  ): Promise<{ customerPayload: Customer[]; paginationMeta?: any }> {
    const { paginationPayload } = getCustomerRecordOptions

    const customerQuery = Customer.query()

    if (paginationPayload) {
      const customers = await customerQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload!.page, paginationPayload!.limit)

      return {
        customerPayload: customers.all(),
        paginationMeta: customers.getMeta(),
      }
    }
    const customers = await customerQuery.orderBy('created_at', 'desc')
    return {
      customerPayload: customers,
    }
  }

  public static async deleteCustomerAuthenticationToken(customerId: number) {
    await db.from('auth_access_tokens').where('tokenable_id', customerId).delete()
  }
}
