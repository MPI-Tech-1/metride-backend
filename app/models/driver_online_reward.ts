import AbstractModel from '#models/abstract_model'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Driver from '#models/driver'

export default class DriverOnlineReward extends AbstractModel {
  @column()
  declare driverId: number

  @column.date()
  declare rewardDate: DateTime

  @column()
  declare windowStartTime: string

  @column()
  declare windowEndTime: string

  @column()
  declare onlineMinutes: number

  /** Kobo */
  @column({ consume: (value) => Number(value) })
  declare amount: number

  @column()
  declare driverWalletTransactionId: number

  @belongsTo(() => Driver)
  declare driver: BelongsTo<typeof Driver>
}
