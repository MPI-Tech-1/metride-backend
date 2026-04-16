import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'

export default class DriverDocument extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare driverLicenceUrl: string

  @column()
  declare passportPhotographUrl: string

  @column()
  declare vehiclePaperUrl: string

  @column()
  declare vehiclePhotoUrl: string
}
