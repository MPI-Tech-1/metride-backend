import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'

export default class DriverLocation extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare latitude: string

  @column()
  declare longitude: string
}
