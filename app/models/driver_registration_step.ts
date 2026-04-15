import { DriverRegistrationStepSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class DriverRegistrationStep extends DriverRegistrationStepSchema {
  @column()
  declare driverId: number

  @column({ consume: (value) => value === 1 })
  declare hasActivatedAccount: boolean
}
