import { belongsTo, column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Driver from '#models/driver'
import DriverWallet from '#models/driver_wallet'

export default class DriverWalletWithdrawalRequest extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare driverWalletId: number

  @column()
  declare amount: number

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @belongsTo(() => Driver)
  declare driver: BelongsTo<typeof Driver>

  @belongsTo(() => DriverWallet)
  declare driverWallet: BelongsTo<typeof DriverWallet>
}
