import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class PromotionRedemption extends AbstractModel {
  @column() declare promotionId: number
  @column() declare customerId: number
  @column() declare bookingId: number
  @column() declare bookingPaymentId: number
  @column() declare baseAmount: number
  @column() declare discountAmount: number
  @column() declare status: 'reserved' | 'redeemed' | 'released'
  @column.dateTime() declare redeemedAt: DateTime | null
  @column.dateTime() declare releasedAt: DateTime | null
}
