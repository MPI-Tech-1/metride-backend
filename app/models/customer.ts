import { column, hasOne } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import CustomerRegistrationStep from '#models/customer_registration_step'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import AbstractModel from '#models/abstract_model'

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

  @column()
  declare fcmToken: string

  @hasOne(() => CustomerRegistrationStep)
  declare customerRegistrationStep: HasOne<typeof CustomerRegistrationStep>

  static accessTokens = DbAccessTokensProvider.forModel(Customer, {
    table: 'auth_access_tokens',
  })
}
