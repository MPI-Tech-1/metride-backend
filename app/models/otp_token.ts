import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AbstractModel from '#models/abstract_model'

export default class OtpToken extends AbstractModel {
  @column()
  declare email: string

  @column()
  declare token: string

  @column.dateTime()
  declare expiresAt: DateTime

  @column()
  declare purpose: 'password-reset' | 'account-activation'

  @column()
  declare status: 'pending' | 'used' | 'expired'
}
