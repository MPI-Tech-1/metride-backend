import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Promotion extends AbstractModel {
  @column() declare code: string
  @column() declare name: string
  @column() declare description: string | null
  @column() declare discountType: 'percentage' | 'fixed'
  @column() declare discountValue: number
  @column() declare maximumDiscountAmount: number | null
  @column() declare minimumBookingAmount: number
  @column() declare globalUsageLimit: number | null
  @column() declare usageLimitPerCustomer: number
  @column() declare applicableBookingType: 'all' | 'instant' | 'shuttle'
  @column.dateTime() declare startsAt: DateTime | null
  @column.dateTime() declare endsAt: DateTime | null
  @column({ consume: (value) => value === 1 }) declare isActive: boolean
}
