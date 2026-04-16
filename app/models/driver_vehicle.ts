import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'

export default class DriverVehicle extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare vehicleMakeId: number

  @column()
  declare vehicleModelId: number

  @column()
  declare colorOfVehicle: string

  @column()
  declare plateNumber: string

  @column()
  declare seatCapacity: number

  @column()
  declare typeOfVehicle: string
}
