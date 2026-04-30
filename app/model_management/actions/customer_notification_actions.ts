import type CreateCustomerNotificationRecordOptions from '#model_management/type_checking/customer_notification/create_customer_notification_record_options'
import type ListCustomerNotificationRecordsOptions from '#model_management/type_checking/customer_notification/list_customer_notification_records_options'
import type UpdateCustomerNotificationRecordOptions from '#model_management/type_checking/customer_notification/update_customer_notification_record_options'
import type CustomerNotificationIdentifierOptions from '#model_management/type_checking/customer_notification/customer_notification_identifier_options'
import CustomerNotification from '#models/customer_notification'

export default class CustomerNotificationActions {
  public static async createCustomerNotificationRecord(
    createCustomerNotificationRecordOptions: CreateCustomerNotificationRecordOptions
  ): Promise<CustomerNotification> {
    const { createPayload, dbTransactionOptions } = createCustomerNotificationRecordOptions

    const customerNotification = new CustomerNotification()
    Object.assign(customerNotification, createPayload)

    if (dbTransactionOptions.useTransaction) {
      customerNotification.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customerNotification.save()

    return customerNotification
  }

  public static async getCustomerNotificationById(
    customerNotificationId: number
  ): Promise<CustomerNotification | null> {
    return await CustomerNotification.query().where('id', customerNotificationId).first()
  }

  public static async getCustomerNotificationByIdentifier(
    customerNotificationIdentifier: string
  ): Promise<CustomerNotification | null> {
    return await CustomerNotification.query()
      .where('identifier', customerNotificationIdentifier)
      .first()
  }

  public static async getCustomerNotification(
    getCustomerNotificationOptions: CustomerNotificationIdentifierOptions
  ): Promise<CustomerNotification | null> {
    const { identifier, identifierType } = getCustomerNotificationOptions

    const GetCustomerNotificationIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getCustomerNotificationById(Number(identifier)),

      identifier: async () => await this.getCustomerNotificationByIdentifier(String(identifier)),
    }

    return await GetCustomerNotificationIdentifierOptions[identifierType]()
  }

  public static async updateCustomerNotificationRecord(
    updateCustomerNotificationRecordOptions: UpdateCustomerNotificationRecordOptions
  ): Promise<CustomerNotification | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateCustomerNotificationRecordOptions

    const customerNotification = await this.getCustomerNotification(identifierOptions)

    if (customerNotification === null) return null

    Object.assign(customerNotification, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      customerNotification.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await customerNotification.save()

    return customerNotification
  }

  public static async listCustomerNotifications(
    getCustomerNotificationRecordOptions: ListCustomerNotificationRecordsOptions
  ): Promise<{ customerNotificationPayload: CustomerNotification[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getCustomerNotificationRecordOptions

    const customerNotificationQuery = CustomerNotification.query()

    if (filterRecordOptionsPayload?.customerId) {
      customerNotificationQuery.where('customerId', filterRecordOptionsPayload.customerId)
    }

    if (filterRecordOptionsPayload?.isNotificationRead !== undefined) {
      customerNotificationQuery.where(
        'isNotificationRead',
        filterRecordOptionsPayload.isNotificationRead
      )
    }

    if (filterRecordOptionsPayload?.searchQuery) {
      customerNotificationQuery.whereILike('content', `%${filterRecordOptionsPayload.searchQuery}%`)
    }

    if (paginationPayload) {
      const customerNotifications = await customerNotificationQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload!.page, paginationPayload!.limit)

      return {
        customerNotificationPayload: customerNotifications.all(),
        paginationMeta: customerNotifications.getMeta(),
      }
    }
    const customerNotifications = await customerNotificationQuery.orderBy('created_at', 'desc')
    return {
      customerNotificationPayload: customerNotifications,
    }
  }
}
