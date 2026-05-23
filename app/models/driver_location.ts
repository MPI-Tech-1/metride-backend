import AbstractModel from '#models/abstract_model'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import Driver from '#models/driver'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'

export default class DriverLocation extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare latitude: string

  @column()
  declare longitude: string

  @belongsTo(() => Driver)
  declare driver: BelongsTo<typeof Driver>
}
