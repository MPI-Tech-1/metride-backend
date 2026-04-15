import { CustomerRegistrationStepSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class CustomerRegistrationStep extends CustomerRegistrationStepSchema {
  @column()
  declare customerId: number

  @column({ consume: (value) => value === 1 })
  declare hasActivatedAccount: boolean
}
