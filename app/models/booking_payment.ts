import { belongsTo, column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Booking from '#models/booking'

export default class BookingPayment extends AbstractModel {
  @column()
  declare bookingId: number

  @column()
  declare basePrice: number

  @column()
  declare discountAmount: number

  @column()
  declare amountPaid: number

  @belongsTo(() => Booking)
  declare booking: BelongsTo<typeof Booking>
}
