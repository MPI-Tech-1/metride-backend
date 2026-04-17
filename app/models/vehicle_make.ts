import { column, hasMany } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import VehicleModel from '#models/vehicle_model'

export default class VehicleMake extends AbstractModel {
  @column()
  declare name: string

  @hasMany(() => VehicleModel)
  declare vehicleModels: HasMany<typeof VehicleModel>
}
