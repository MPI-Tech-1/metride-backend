import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'

export default class DriverWalletWithdrawalRequest extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare driverWalletId: number

  @column()
  declare amount: number

  @column()
  declare status: 'pending' | 'approved' | 'rejected'
}
