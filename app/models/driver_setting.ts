import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'

export default class DriverSetting extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare commissionPercentage: number
}
