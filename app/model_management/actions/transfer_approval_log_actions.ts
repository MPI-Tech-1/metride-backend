import type CreateTransferApprovalLogRecordOptions from '#model_management/type_checking/transfer_approval_log/create_transfer_approval_log_record_options'
import type ListTransferApprovalLogRecordsOptions from '#model_management/type_checking/transfer_approval_log/list_transfer_approval_log_records_options'
import type UpdateTransferApprovalLogRecordOptions from '#model_management/type_checking/transfer_approval_log/update_transfer_approval_log_record_options'
import type TransferApprovalLogIdentifierOptions from '#model_management/type_checking/transfer_approval_log/transfer_approval_log_identifier_options'
import TransferApprovalLog from '#models/transfer_approval_log'

export default class TransferApprovalLogActions {
  public static async createTransferApprovalLogRecord(
    createTransferApprovalLogRecordOptions: CreateTransferApprovalLogRecordOptions
  ): Promise<TransferApprovalLog> {
    const { createPayload, dbTransactionOptions } = createTransferApprovalLogRecordOptions

    const transferApprovalLog = new TransferApprovalLog()
    Object.assign(transferApprovalLog, createPayload)

    if (dbTransactionOptions.useTransaction) {
      transferApprovalLog.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await transferApprovalLog.save()

    return transferApprovalLog
  }

  private static async getTransferApprovalLogById(
    transferApprovalLogId: number
  ): Promise<TransferApprovalLog | null> {
    return await TransferApprovalLog.query().where('id', transferApprovalLogId).first()
  }

  private static async getTransferApprovalLogByIdentifier(
    transferApprovalLogIdentifier: string
  ): Promise<TransferApprovalLog | null> {
    return await TransferApprovalLog.query()
      .where('identifier', transferApprovalLogIdentifier)
      .first()
  }

  public static async getTransferApprovalLog(
    getTransferApprovalLogOptions: TransferApprovalLogIdentifierOptions
  ): Promise<TransferApprovalLog | null> {
    const { identifier, identifierType } = getTransferApprovalLogOptions

    const GetTransferApprovalLogIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getTransferApprovalLogById(Number(identifier)),

      identifier: async () => await this.getTransferApprovalLogByIdentifier(String(identifier)),
    }

    return await GetTransferApprovalLogIdentifierOptions[identifierType]()
  }

  public static async updateTransferApprovalLogRecord(
    updateTransferApprovalLogRecordOptions: UpdateTransferApprovalLogRecordOptions
  ): Promise<TransferApprovalLog | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateTransferApprovalLogRecordOptions

    const transferApprovalLog = await this.getTransferApprovalLog(identifierOptions)

    if (transferApprovalLog === null) return null

    Object.assign(transferApprovalLog, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      transferApprovalLog.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await transferApprovalLog.save()

    return transferApprovalLog
  }

  public static async listTransferApprovalLogs(
    getTransferApprovalLogRecordOptions: ListTransferApprovalLogRecordsOptions
  ): Promise<{ transferApprovalLogPayload: TransferApprovalLog[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getTransferApprovalLogRecordOptions

    const transferApprovalLogQuery = TransferApprovalLog.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      transferApprovalLogQuery
        .whereILike('provider', searchValue)
        .orWhereILike('identifier', searchValue)
    }

    if (paginationPayload) {
      const transferApprovalLogs = await transferApprovalLogQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        transferApprovalLogPayload: transferApprovalLogs.all(),
        paginationMeta: transferApprovalLogs.getMeta(),
      }
    }

    const transferApprovalLogs = await transferApprovalLogQuery.orderBy('created_at', 'desc')
    return {
      transferApprovalLogPayload: transferApprovalLogs,
    }
  }
}
