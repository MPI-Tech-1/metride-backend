import { column, computed } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import AbstractModel from '#models/abstract_model'
import AdminRoleEnum from '#common/enums/admin_role_enum'

export default class Admin extends AbstractModel {
  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare role: AdminRoleEnum

  @computed()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  @column({ serializeAs: null })
  declare password: string

  static accessTokens = DbAccessTokensProvider.forModel(Admin, {
    table: 'auth_access_tokens',
  })
}
