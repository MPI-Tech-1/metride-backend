import { hasOne } from '@adonisjs/lucid/orm'
import { CustomerSchema } from '#database/schema'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import CustomerRegistrationStep from '#models/customer_registration_step'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Customer extends CustomerSchema {
  @hasOne(() => CustomerRegistrationStep)
  declare customerRegistrationStep: HasOne<typeof CustomerRegistrationStep>

  static accessTokens = DbAccessTokensProvider.forModel(Customer, {
    table: 'auth_access_tokens',
  })
}
