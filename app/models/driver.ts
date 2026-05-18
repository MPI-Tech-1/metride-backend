import { column, computed, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import AbstractModel from '#models/abstract_model'
import DriverRegistrationStep from '#models/driver_registration_step'
import { DateTime } from 'luxon'
import DriverApprovalStep from '#models/driver_approval_step'
import DriverVehicle from '#models/driver_vehicle'
import DriverBankAccount from '#models/driver_bank_account'
import DriverDocument from '#models/driver_document'
import DriverPersonalInformation from '#models/driver_personal_information'
import Booking from '#models/booking'
import DriverLocation from '#models/driver_location'
import DriverSetting from '#models/driver_setting'

export default class Driver extends AbstractModel {
  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare mobileNumber: string

  @computed()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  @column({ serializeAs: null })
  declare password: string

  @column({ consume: (value) => value === 1 })
  declare isDriverActiveForTrip: boolean

  @column()
  declare fcmToken: string

  @column()
  declare lastLoggedInAt: DateTime

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @hasMany(() => Booking, {
    foreignKey: 'assignedDriverId',
  })
  declare assignedBookings: HasMany<typeof Booking>

  @hasMany(() => DriverLocation)
  declare driverLocations: HasMany<typeof DriverLocation>

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

  @hasOne(() => DriverSetting)
  declare driverSetting: HasOne<typeof DriverSetting>

  static accessTokens = DbAccessTokensProvider.forModel(Driver, {
    table: 'auth_access_tokens',
  })
}
