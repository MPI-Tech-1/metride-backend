import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'

export default class DriverVehiclePhoto extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare section: 'front' | 'side' | 'back' | 'interior'

  @column()
  declare photoUrl: string
}
