import type CreateVehicleMakeRecordOptions from '#model_management/type_checking/vehicle_make/create_vehicle_make_record_options'
import type ListVehicleMakeRecordsOptions from '#model_management/type_checking/vehicle_make/list_vehicle_make_records_options'
import type UpdateVehicleMakeRecordOptions from '#model_management/type_checking/vehicle_make/update_vehicle_make_record_options'
import type VehicleMakeIdentifierOptions from '#model_management/type_checking/vehicle_make/vehicle_make_identifier_options'
import VehicleMake from '#models/vehicle_make'

export default class VehicleMakeActions {
  public static async createVehicleMakeRecord(
    createVehicleMakeRecordOptions: CreateVehicleMakeRecordOptions
  ): Promise<VehicleMake> {
    const { createPayload, dbTransactionOptions } = createVehicleMakeRecordOptions

    const vehicleMake = new VehicleMake()
    Object.assign(vehicleMake, createPayload)

    if (dbTransactionOptions.useTransaction) {
      vehicleMake.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await vehicleMake.save()

    return vehicleMake
  }

  public static async getVehicleMakeById(vehicleMakeId: number): Promise<VehicleMake | null> {
    return await VehicleMake.query().preload('vehicleModels').where('id', vehicleMakeId).first()
  }

  public static async getVehicleMakeByIdentifier(
    vehicleMakeIdentifier: string
  ): Promise<VehicleMake | null> {
    return await VehicleMake.query()
      .preload('vehicleModels')
      .where('identifier', vehicleMakeIdentifier)
      .first()
  }

  public static async getVehicleMake(
    getVehicleMakeOptions: VehicleMakeIdentifierOptions
  ): Promise<VehicleMake | null> {
    const { identifier, identifierType } = getVehicleMakeOptions

    const GetVehicleMakeIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getVehicleMakeById(Number(identifier)),

      identifier: async () => await this.getVehicleMakeByIdentifier(String(identifier)),
    }

    return await GetVehicleMakeIdentifierOptions[identifierType]()
  }

  public static async updateVehicleMakeRecord(
    updateVehicleMakeRecordOptions: UpdateVehicleMakeRecordOptions
  ): Promise<VehicleMake | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } =
      updateVehicleMakeRecordOptions

    const vehicleMake = await this.getVehicleMake(identifierOptions)

    if (vehicleMake === null) return null

    Object.assign(vehicleMake, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      vehicleMake.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await vehicleMake.save()

    return vehicleMake
  }

  public static async listVehicleMakes(
    getVehicleMakeRecordOptions: ListVehicleMakeRecordsOptions
  ): Promise<{ vehicleMakePayload: VehicleMake[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getVehicleMakeRecordOptions

    const vehicleMakeQuery = VehicleMake.query().preload('vehicleModels')

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      vehicleMakeQuery.whereILike('name', searchValue).orWhereILike('identifier', searchValue)
    }

    if (paginationPayload) {
      const vehicleMakes = await vehicleMakeQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        vehicleMakePayload: vehicleMakes.all(),
        paginationMeta: vehicleMakes.getMeta(),
      }
    }

    const vehicleMakes = await vehicleMakeQuery.orderBy('created_at', 'desc')
    return {
      vehicleMakePayload: vehicleMakes,
    }
  }
}
