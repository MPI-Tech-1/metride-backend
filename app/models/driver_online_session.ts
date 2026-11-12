import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class DriverOnlineSession extends AbstractModel {
  @column()
  declare driverId: number

  @column.dateTime()
  declare startedAt: DateTime

  @column.dateTime()
  declare endedAt: DateTime | null
}
