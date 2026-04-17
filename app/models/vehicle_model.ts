import { belongsTo, column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import VehicleMake from '#models/vehicle_make'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class VehicleModel extends AbstractModel {
  @column()
  declare name: string

  @column()
  declare vehicleMakeId: number

  @belongsTo(() => VehicleMake)
  declare vehicleMake: BelongsTo<typeof VehicleMake>
}
