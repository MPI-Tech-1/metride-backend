import type CreateVehicleModelRecordOptions from '#model_management/type_checking/vehicle_model/create_vehicle_model_record_options'
import type ListVehicleModelRecordsOptions from '#model_management/type_checking/vehicle_model/list_vehicle_model_records_options'
import type UpdateVehicleModelRecordOptions from '#model_management/type_checking/vehicle_model/update_vehicle_model_record_options'
import type VehicleModelIdentifierOptions from '#model_management/type_checking/vehicle_model/vehicle_model_identifier_options'
import VehicleModel from '#models/vehicle_model'

export default class VehicleModelActions {
  public static async createVehicleModelRecord(
    createVehicleModelRecordOptions: CreateVehicleModelRecordOptions
  ): Promise<VehicleModel> {
    const { createPayload, dbTransactionOptions } = createVehicleModelRecordOptions

    const vehicleModel = new VehicleModel()
    Object.assign(vehicleModel, createPayload)

    if (dbTransactionOptions.useTransaction) {
      vehicleModel.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await vehicleModel.save()

    return vehicleModel
  }

  public static async getVehicleModelById(vehicleModelId: number): Promise<VehicleModel | null> {
    return await VehicleModel.query().preload('vehicleMake').where('id', vehicleModelId).first()
  }

  public static async getVehicleModelByIdentifier(
    vehicleModelIdentifier: string
  ): Promise<VehicleModel | null> {
    return await VehicleModel.query()
      .preload('vehicleMake')
      .where('identifier', vehicleModelIdentifier)
      .first()
  }

  public static async getVehicleModel(
    getVehicleModelOptions: VehicleModelIdentifierOptions
  ): Promise<VehicleModel | null> {
    const { identifier, identifierType } = getVehicleModelOptions

    const GetVehicleModelIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getVehicleModelById(Number(identifier)),

      identifier: async () => await this.getVehicleModelByIdentifier(String(identifier)),
    }

    return await GetVehicleModelIdentifierOptions[identifierType]()
  }

  public static async updateVehicleModelRecord(
    updateVehicleModelRecordOptions: UpdateVehicleModelRecordOptions
  ): Promise<VehicleModel | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateVehicleModelRecordOptions

    const vehicleModel = await this.getVehicleModel(identifierOptions)

    if (vehicleModel === null) return null

    Object.assign(vehicleModel, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      vehicleModel.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await vehicleModel.save()

    return vehicleModel
  }

  public static async listVehicleModels(
    getVehicleModelRecordOptions: ListVehicleModelRecordsOptions
  ): Promise<{ vehicleModelPayload: VehicleModel[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getVehicleModelRecordOptions

    const vehicleModelQuery = VehicleModel.query().preload('vehicleMake')

    if (filterRecordOptionsPayload?.vehicleMakeId) {
      vehicleModelQuery.where('vehicle_make_id', filterRecordOptionsPayload.vehicleMakeId)
    }

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      vehicleModelQuery.whereILike('name', searchValue).orWhereILike('identifier', searchValue)
    }

    if (paginationPayload) {
      const vehicleModels = await vehicleModelQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        vehicleModelPayload: vehicleModels.all(),
        paginationMeta: vehicleModels.getMeta(),
      }
    }

    const vehicleModels = await vehicleModelQuery.orderBy('created_at', 'desc')
    return {
      vehicleModelPayload: vehicleModels,
    }
  }
}
