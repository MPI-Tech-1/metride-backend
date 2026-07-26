import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { DateTime } from 'luxon'

export default class MvestOwner extends AbstractModel {
  @column() declare firstName: string
  @column() declare lastName: string
  @column() declare email: string
  @column() declare mobileNumber: string
  @column({ serializeAs: null }) declare password: string
  @column() declare status: 'pending' | 'active' | 'suspended'
  @column() declare bankName: string | null
  @column() declare accountName: string | null
  @column() declare accountNumber: string | null
  @column.dateTime() declare lastLoggedInAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(MvestOwner, {
    table: 'auth_access_tokens',
  })
}
