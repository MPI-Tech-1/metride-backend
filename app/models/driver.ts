import { column, hasOne } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import AbstractModel from '#models/abstract_model'
import DriverRegistrationStep from '#models/driver_registration_step'

export default class Driver extends AbstractModel {
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

  @hasOne(() => DriverRegistrationStep)
  declare driverRegistrationStep: HasOne<typeof DriverRegistrationStep>

  static accessTokens = DbAccessTokensProvider.forModel(Driver, {
    table: 'auth_access_tokens',
  })
}
