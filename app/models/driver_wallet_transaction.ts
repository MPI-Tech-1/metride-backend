import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'

export default class DriverWalletTransaction extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare driverWalletId: number

  @column()
  declare amount: number

  @column()
  declare systemGeneratedTransactionReference: string

  @column()
  declare providerTransactionReference: string | null

  @column()
  declare remark: string | null

  @column()
  declare typeOfTransaction: 'debit' | 'credit'

  @column()
  declare status: 'pending' | 'completed' | 'failed'

  @column()
  declare transactionLogs: string | null
}
