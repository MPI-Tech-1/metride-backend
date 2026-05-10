import { belongsTo, column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import Driver from '#models/driver'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Admin from '#models/admin'

export default class DriverApprovalStep extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare performedByAdminId: number

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @column()
  declare reason: string

  @belongsTo(() => Driver)
  declare driver: BelongsTo<typeof Driver>

  @belongsTo(() => Admin)
  declare performedByAdmin: BelongsTo<typeof Admin>
}
