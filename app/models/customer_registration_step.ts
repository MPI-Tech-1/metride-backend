import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'

export default class CustomerRegistrationStep extends AbstractModel {
  @column()
  declare customerId: number

  @column({ consume: (value) => value === 1 })
  declare hasActivatedAccount: boolean
}
