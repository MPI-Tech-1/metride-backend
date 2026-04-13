import { CustomerSchema } from '#database/schema'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class Customer extends CustomerSchema {
  static accessTokens = DbAccessTokensProvider.forModel(Customer, {
    table: 'auth_access_tokens',
  })
}
