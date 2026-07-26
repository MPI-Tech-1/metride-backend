import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class MvestVehicleAgreement extends AbstractModel {
  @column() declare mvestOwnerId: number
  @column() declare driverVehicleId: number
  @column() declare commissionPercentage: number
  @column.dateTime() declare startsAt: DateTime
  @column.dateTime() declare endsAt: DateTime | null
  @column({ consume: (value) => value === 1 }) declare isActive: boolean
}
