import { OtpTokenSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class OtpToken extends OtpTokenSchema {
  @column()
  declare purpose: 'password-reset' | 'account-activation'

  @column()
  declare status: 'pending' | 'used' | 'expired'
}
