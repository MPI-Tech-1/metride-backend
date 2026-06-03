import { belongsTo, column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import InvestorVehicle from '#models/investor_vehicle'
import { DateTime } from 'luxon'

export default class InvestorVehicleEarning extends AbstractModel {
  @column()
  declare investorVehicleId: number

  @column()
  declare amount: number

  @column()
  declare status: 'pending' | 'paid'

  @column()
  declare description: string | null

  @column.dateTime({
    serialize: (dateValue: DateTime | null) => {
      return dateValue
        ? dateValue.setZone('Africa/Lagos').toLocaleString(DateTime.DATETIME_FULL)
        : dateValue
    },
  })
  declare paidAt: DateTime | null

  @belongsTo(() => InvestorVehicle)
  declare investorVehicle: BelongsTo<typeof InvestorVehicle>
}
