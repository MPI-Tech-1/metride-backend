import AbstractModel from '#models/abstract_model'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Driver from '#models/driver'
import DriverWallet from '#models/driver_wallet'

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

  @belongsTo(() => Driver)
  declare driver: BelongsTo<typeof Driver>

  @belongsTo(() => DriverWallet)
  declare driverWallet: BelongsTo<typeof DriverWallet>
}
