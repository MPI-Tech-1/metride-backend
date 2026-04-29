import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'
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
}
