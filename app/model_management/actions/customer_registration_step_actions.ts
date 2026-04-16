import CreateCustomerRegistrationStepRecordOptions from '#model_management/type_checking/customer_registration_step/create_customer_registration_step_record_options'
import ListCustomerRegistrationStepRecordsOptions from '#model_management/type_checking/customer_registration_step/list_customer_registration_step_records_options'
import UpdateCustomerRegistrationStepRecordOptions from '#model_management/type_checking/customer_registration_step/update_customer_registration_step_record_options'
import CustomerRegistrationStepIdentifierOptions from '#model_management/type_checking/customer_registration_step/customer_registration_step_identifier_options'
import CustomerRegistrationStep from '#models/customer_registration_step'

export default class CustomerRegistrationStepActions {
  public static async createCustomerRegistrationStepRecord(
    createCustomerRegistrationStepRecordOptions: CreateCustomerRegistrationStepRecordOptions
  ): Promise<CustomerRegistrationStep> {
    const { createPayload, dbTransactionOptions } = createCustomerRegistrationStepRecordOptions

    const customerRegistrationStep = new CustomerRegistrationStep()
    Object.assign(customerRegistrationStep, createPayload)

    if (dbTransactionOptions.useTransaction) {
      customerRegistrationStep.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customerRegistrationStep.save()

    return customerRegistrationStep
  }

  public static async getCustomerRegistrationStepById(
    id: number
  ): Promise<CustomerRegistrationStep | null> {
    return await CustomerRegistrationStep.query().where('id', id).first()
  }

  public static async getCustomerRegistrationStepByIdentifier(
    identifier: string
  ): Promise<CustomerRegistrationStep | null> {
    return await CustomerRegistrationStep.query()
      .where('identifier', identifier)

      .first()
  }

  public static async getCustomerRegistrationStepByCustomerId(
    customerId: number
  ): Promise<CustomerRegistrationStep | null> {
    return await CustomerRegistrationStep.query()
      .where('customer_id', customerId)

      .first()
  }

  public static async getCustomerRegistrationStep(
    getCustomerRegistrationStepOptions: CustomerRegistrationStepIdentifierOptions
  ): Promise<CustomerRegistrationStep | null> {
    const { identifier, identifierType } = getCustomerRegistrationStepOptions

    const GetCustomerRegistrationStepIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getCustomerRegistrationStepById(Number(identifier)),

      identifier: async () =>
        await this.getCustomerRegistrationStepByIdentifier(String(identifier)),

      customerId: async () =>
        await this.getCustomerRegistrationStepByCustomerId(Number(identifier)),
    }

    return await GetCustomerRegistrationStepIdentifierOptions[identifierType]()
  }

  public static async updateCustomerRegistrationStepRecord(
    updateCustomerRegistrationStepRecordOptions: UpdateCustomerRegistrationStepRecordOptions
  ): Promise<CustomerRegistrationStep | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateCustomerRegistrationStepRecordOptions

    const customerRegistrationStep = await this.getCustomerRegistrationStep(identifierOptions)

    if (customerRegistrationStep === null) return null

    Object.assign(customerRegistrationStep, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      customerRegistrationStep.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customerRegistrationStep.save()

    return customerRegistrationStep
  }

  public static async listCustomerRegistrationSteps(
    listCustomerRegistrationStepRecordsOptions: ListCustomerRegistrationStepRecordsOptions
  ): Promise<{
    customerRegistrationStepPayload: CustomerRegistrationStep[]
    paginationMeta?: any
  }> {
    const { filterRecordOptionsPayload, paginationPayload } =
      listCustomerRegistrationStepRecordsOptions

    const customerRegistrationStepQuery = CustomerRegistrationStep.query()

    if (filterRecordOptionsPayload?.customerId) {
      customerRegistrationStepQuery.where('customer_id', filterRecordOptionsPayload.customerId)
    }

    if (typeof filterRecordOptionsPayload?.hasActivatedAccount === 'boolean') {
      customerRegistrationStepQuery.where(
        'has_activated_account',
        filterRecordOptionsPayload.hasActivatedAccount
      )
    }

    if (paginationPayload) {
      const customerRegistrationSteps = await customerRegistrationStepQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        customerRegistrationStepPayload: customerRegistrationSteps.all(),
        paginationMeta: customerRegistrationSteps.getMeta(),
      }
    }

    const customerRegistrationSteps = await customerRegistrationStepQuery.orderBy(
      'created_at',
      'desc'
    )
    return {
      customerRegistrationStepPayload: customerRegistrationSteps,
    }
  }
}
