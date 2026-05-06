import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
export default class BookingGpsLog extends AbstractModel {
  @column()
  declare bookingId: number

  @column()
  declare customerId: number

  @column()
  declare driverId: number

  @column()
  declare gpsCoordinates: string
}
