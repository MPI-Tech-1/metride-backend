import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'

export default class DriverWallet extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare totalInflowFunds: number

  @column()
  declare totalOutflowFunds: number

  @column()
  declare balance: number
}
