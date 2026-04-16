import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'

export default class VehicleModel extends AbstractModel {
  @column()
  declare name: string

  @column()
  declare vehicleMakeId: number
}
