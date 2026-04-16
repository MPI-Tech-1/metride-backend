import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'

export default class DriverBankAccount extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare bankId: number

  @column()
  declare accountName: string

  @column()
  declare accountNumber: string
}
