import type CreateDriverApprovalStepRecordOptions from '#model_management/type_checking/driver_approval_step/create_driver_approval_step_record_options'
import type ListDriverApprovalStepRecordsOptions from '#model_management/type_checking/driver_approval_step/list_driver_approval_step_records_options'
import type UpdateDriverApprovalStepRecordOptions from '#model_management/type_checking/driver_approval_step/update_driver_approval_step_record_options'
import type DriverApprovalStepIdentifierOptions from '#model_management/type_checking/driver_approval_step/driver_approval_step_identifier_options'
import DriverApprovalStep from '#models/driver_approval_step'

export default class DriverApprovalStepActions {
  public static async createDriverApprovalStepRecord(
    createDriverApprovalStepRecordOptions: CreateDriverApprovalStepRecordOptions
  ): Promise<DriverApprovalStep> {
    const { createPayload, dbTransactionOptions } = createDriverApprovalStepRecordOptions

    const driverApprovalStep = new DriverApprovalStep()
    Object.assign(driverApprovalStep, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverApprovalStep.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverApprovalStep.save()

    return driverApprovalStep
  }

  private static async getDriverApprovalStepById(id: number): Promise<DriverApprovalStep | null> {
    return await DriverApprovalStep.query().where('id', id).first()
  }

  private static async getDriverApprovalStepByIdentifier(
    identifier: string
  ): Promise<DriverApprovalStep | null> {
    return await DriverApprovalStep.query()
      .where('identifier', identifier)

      .first()
  }

  private static async getDriverApprovalStepByDriverId(
    driverId: number
  ): Promise<DriverApprovalStep | null> {
    return await DriverApprovalStep.query()
      .where('driver_id', driverId)

      .first()
  }

  private static async getDriverApprovalStep(
    getDriverApprovalStepOptions: DriverApprovalStepIdentifierOptions
  ): Promise<DriverApprovalStep | null> {
    const { identifier, identifierType } = getDriverApprovalStepOptions

    const GetDriverApprovalStepIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverApprovalStepById(Number(identifier)),

      identifier: async () => await this.getDriverApprovalStepByIdentifier(String(identifier)),

      driverId: async () => await this.getDriverApprovalStepByDriverId(Number(identifier)),
    }

    return await GetDriverApprovalStepIdentifierOptions[identifierType]()
  }

  public static async updateDriverApprovalStepRecord(
    updateDriverApprovalStepRecordOptions: UpdateDriverApprovalStepRecordOptions
  ): Promise<DriverApprovalStep | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverApprovalStepRecordOptions

    const driverApprovalStep = await this.getDriverApprovalStep(identifierOptions)

    if (driverApprovalStep === null) return null

    Object.assign(driverApprovalStep, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverApprovalStep.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverApprovalStep.save()

    return driverApprovalStep
  }

  public static async listDriverApprovalSteps(
    listDriverApprovalStepRecordsOptions: ListDriverApprovalStepRecordsOptions
  ): Promise<{ driverApprovalStepPayload: DriverApprovalStep[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = listDriverApprovalStepRecordsOptions

    const driverApprovalStepQuery = DriverApprovalStep.query()

    if (filterRecordOptionsPayload?.driverId) {
      driverApprovalStepQuery.where('driver_id', filterRecordOptionsPayload.driverId)
    }

    if (paginationPayload) {
      const driverApprovalSteps = await driverApprovalStepQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverApprovalStepPayload: driverApprovalSteps.all(),
        paginationMeta: driverApprovalSteps.getMeta(),
      }
    }

    const driverApprovalSteps = await driverApprovalStepQuery.orderBy('created_at', 'desc')
    return {
      driverApprovalStepPayload: driverApprovalSteps,
    }
  }
}
