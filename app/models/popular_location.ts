import AbstractModel from '#models/abstract_model'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import City from '#models/city'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
export default class PopularLocation extends AbstractModel {
  @column()
  declare cityId: number

  @column()
  declare name: string

  @column()
  declare gpsCoordinates: string

  @column()
  declare typeOfLocation: string

  @column({ consume: (value) => value === 1 })
  declare isActive: boolean

  @belongsTo(() => City)
  declare city: BelongsTo<typeof City>
}
