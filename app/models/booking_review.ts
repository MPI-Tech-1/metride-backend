import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'

export default class BookingReview extends AbstractModel {
  @column()
  declare customerId: number

  @column()
  declare driverId: number

  @column()
  declare bookingId: number

  @column()
  declare rating: number

  @column()
  declare review: string | null
}
