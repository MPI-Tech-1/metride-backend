import { column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import AbstractModel from '#models/abstract_model'
import DriverRegistrationStep from '#models/driver_registration_step'
import { DateTime } from 'luxon'
import DriverApprovalStep from '#models/driver_approval_step'
import DriverVehicle from './driver_vehicle.ts'
import DriverBankAccount from './driver_bank_account.ts'
import DriverDocument from './driver_document.ts'
import DriverPersonalInformation from './driver_personal_information.ts'

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

  @column()
  declare lastLoggedInAt: DateTime

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @hasOne(() => DriverRegistrationStep)
  declare driverRegistrationStep: HasOne<typeof DriverRegistrationStep>

  @hasMany(() => DriverApprovalStep)
  declare driverApprovalSteps: HasMany<typeof DriverApprovalStep>

  @hasOne(() => DriverVehicle)
  declare driverVehicle: HasOne<typeof DriverVehicle>

  @hasOne(() => DriverBankAccount)
  declare driverBankAccount: HasOne<typeof DriverBankAccount>

  @hasOne(() => DriverDocument)
  declare driverDocument: HasOne<typeof DriverDocument>

  @hasOne(() => DriverPersonalInformation)
  declare driverPersonalInformation: HasOne<typeof DriverPersonalInformation>

  static accessTokens = DbAccessTokensProvider.forModel(Driver, {
    table: 'auth_access_tokens',
  })
}
