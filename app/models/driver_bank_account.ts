import { belongsTo, column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Bank from '#models/bank'

export default class DriverBankAccount extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare bankId: number

  @column()
  declare accountName: string

  @column()
  declare accountNumber: string

  @belongsTo(() => Bank)
  declare bank: BelongsTo<typeof Bank>
}
