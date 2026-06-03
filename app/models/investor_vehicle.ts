import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Investor from '#models/investor'
import RideType from '#models/ride_type'
import VehicleMake from '#models/vehicle_make'
import VehicleModel from '#models/vehicle_model'
import InvestorVehicleEarning from '#models/investor_vehicle_earning'

export default class InvestorVehicle extends AbstractModel {
  @column()
  declare investorId: number

  @column()
  declare rideTypeId: number | null

  @column()
  declare vehicleMakeId: number | null

  @column()
  declare vehicleModelId: number | null

  @column()
  declare colorOfVehicle: string | null

  @column()
  declare plateNumber: string | null

  @column()
  declare seatCapacity: number

  @column()
  declare percentageShare: number

  @belongsTo(() => Investor)
  declare investor: BelongsTo<typeof Investor>

  @belongsTo(() => RideType)
  declare rideType: BelongsTo<typeof RideType>

  @belongsTo(() => VehicleMake)
  declare vehicleMake: BelongsTo<typeof VehicleMake>

  @belongsTo(() => VehicleModel)
  declare vehicleModel: BelongsTo<typeof VehicleModel>

  @hasMany(() => InvestorVehicleEarning)
  declare earnings: HasMany<typeof InvestorVehicleEarning>
}
