import { belongsTo, column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import VehicleMake from '#models/vehicle_make'
import VehicleModel from '#models/vehicle_model'
import RideType from '#models/ride_type'

export default class DriverVehicle extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare vehicleMakeId: number

  @column()
  declare vehicleModelId: number

  @column()
  declare rideTypeId: number

  @column()
  declare colorOfVehicle: string

  @column()
  declare plateNumber: string

  @column()
  declare seatCapacity: number

  @belongsTo(() => VehicleMake)
  declare vehicleMake: BelongsTo<typeof VehicleMake>

  @belongsTo(() => VehicleModel)
  declare vehicleModel: BelongsTo<typeof VehicleModel>

  @belongsTo(() => RideType)
  declare rideType: BelongsTo<typeof RideType>
}
