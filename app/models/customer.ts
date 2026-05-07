import { column, computed, hasOne } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import CustomerRegistrationStep from '#models/customer_registration_step'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import AbstractModel from '#models/abstract_model'
import { DateTime } from 'luxon'

export default class Customer extends AbstractModel {
  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare mobileNumber: string

  @column({ serializeAs: null })
  declare password: string

  @computed()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  @column()
  declare fcmToken: string

  @column()
  declare lastLoggedInAt: DateTime

  @hasOne(() => CustomerRegistrationStep)
  declare customerRegistrationStep: HasOne<typeof CustomerRegistrationStep>

  static accessTokens = DbAccessTokensProvider.forModel(Customer, {
    table: 'auth_access_tokens',
  })
}
