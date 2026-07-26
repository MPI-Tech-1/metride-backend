import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class MvestEarning extends AbstractModel {
  @column() declare bookingId: number
  @column() declare mvestOwnerId: number
  @column() declare mvestVehicleAgreementId: number
  @column() declare driverVehicleId: number
  @column() declare eligibleAmount: number
  @column() declare commissionPercentage: number
  @column() declare commissionAmount: number
  @column() declare status: 'pending' | 'approved' | 'paid' | 'reversed'
  @column.dateTime() declare paidAt: DateTime | null
}
