import CreateDriverRegistrationStepRecordOptions from '#model_management/type_checking/driver_registration_step/create_driver_registration_step_record_options'
import ListDriverRegistrationStepRecordsOptions from '#model_management/type_checking/driver_registration_step/list_driver_registration_step_records_options'
import UpdateDriverRegistrationStepRecordOptions from '#model_management/type_checking/driver_registration_step/update_driver_registration_step_record_options'
import DriverRegistrationStepIdentifierOptions from '#model_management/type_checking/driver_registration_step/driver_registration_step_identifier_options'
import DriverRegistrationStep from '#models/driver_registration_step'

export default class DriverRegistrationStepActions {
  public static async createDriverRegistrationStepRecord(
    createDriverRegistrationStepRecordOptions: CreateDriverRegistrationStepRecordOptions
  ): Promise<DriverRegistrationStep> {
    const { createPayload, dbTransactionOptions } = createDriverRegistrationStepRecordOptions

    const driverRegistrationStep = new DriverRegistrationStep()
    Object.assign(driverRegistrationStep, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverRegistrationStep.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverRegistrationStep.save()

    return driverRegistrationStep
  }

  public static async getDriverRegistrationStepById(
    id: number
  ): Promise<DriverRegistrationStep | null> {
    return await DriverRegistrationStep.query().where('id', id).whereNull('deleted_at').first()
  }

  public static async getDriverRegistrationStepByIdentifier(
    identifier: string
  ): Promise<DriverRegistrationStep | null> {
    return await DriverRegistrationStep.query()
      .where('identifier', identifier)
      .whereNull('deleted_at')
      .first()
  }

  public static async getDriverRegistrationStepByDriverId(
    driverId: number
  ): Promise<DriverRegistrationStep | null> {
    return await DriverRegistrationStep.query()
      .where('driver_id', driverId)
      .whereNull('deleted_at')
      .first()
  }

  public static async getDriverRegistrationStep(
    getDriverRegistrationStepOptions: DriverRegistrationStepIdentifierOptions
  ): Promise<DriverRegistrationStep | null> {
    const { identifier, identifierType } = getDriverRegistrationStepOptions

    const GetDriverRegistrationStepIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getDriverRegistrationStepById(Number(identifier)),

      identifier: async () =>
        await this.getDriverRegistrationStepByIdentifier(String(identifier)),

      driverId: async () => await this.getDriverRegistrationStepByDriverId(Number(identifier)),
    }

    return await GetDriverRegistrationStepIdentifierOptions[identifierType]()
  }

  public static async updateDriverRegistrationStepRecord(
    updateDriverRegistrationStepRecordOptions: UpdateDriverRegistrationStepRecordOptions
  ): Promise<DriverRegistrationStep | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateDriverRegistrationStepRecordOptions

    const driverRegistrationStep = await this.getDriverRegistrationStep(identifierOptions)

    if (driverRegistrationStep === null) return null

    Object.assign(driverRegistrationStep, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverRegistrationStep.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverRegistrationStep.save()

    return driverRegistrationStep
  }

  public static async listDriverRegistrationSteps(
    listDriverRegistrationStepRecordsOptions: ListDriverRegistrationStepRecordsOptions
  ): Promise<{ driverRegistrationStepPayload: DriverRegistrationStep[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = listDriverRegistrationStepRecordsOptions

    const driverRegistrationStepQuery = DriverRegistrationStep.query().whereNull('deleted_at')

    if (filterRecordOptionsPayload?.driverId) {
      driverRegistrationStepQuery.where('driver_id', filterRecordOptionsPayload.driverId)
    }

    if (typeof filterRecordOptionsPayload?.hasActivatedAccount === 'boolean') {
      driverRegistrationStepQuery.where(
        'has_activated_account',
        filterRecordOptionsPayload.hasActivatedAccount
      )
    }

    if (paginationPayload) {
      const driverRegistrationSteps = await driverRegistrationStepQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        driverRegistrationStepPayload: driverRegistrationSteps.all(),
        paginationMeta: driverRegistrationSteps.getMeta(),
      }
    }

    const driverRegistrationSteps = await driverRegistrationStepQuery.orderBy('created_at', 'desc')
    return {
      driverRegistrationStepPayload: driverRegistrationSteps,
    }
  }
}
