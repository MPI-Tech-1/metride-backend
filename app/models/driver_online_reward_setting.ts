import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'

export default class DriverOnlineRewardSetting extends AbstractModel {
  @column({ consume: (value) => value === 1 || value === true })
  declare isEnabled: boolean

  /** Time of day in Africa/Lagos, "HH:mm" */
  @column()
  declare windowStartTime: string

  /** Time of day in Africa/Lagos, "HH:mm" */
  @column()
  declare windowEndTime: string

  /** Kobo */
  @column({ consume: (value) => Number(value) })
  declare rewardAmount: number

  @column()
  declare graceMinutes: number

  @column()
  declare acceptanceTimeoutMinutes: number
}
