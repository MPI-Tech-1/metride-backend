import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Investor from '#models/investor'
import InvestorVehicleEarning from '#models/investor_vehicle_earning'

export default class InvestorVehicle extends AbstractModel {
  @column()
  declare investorId: number

  @column()
  declare vehicleName: string

  @column()
  declare vehicleType: string

  @column()
  declare plateNumber: string | null

  @column()
  declare investmentAmount: number

  @column()
  declare percentageShare: number

  @belongsTo(() => Investor)
  declare investor: BelongsTo<typeof Investor>

  @hasMany(() => InvestorVehicleEarning)
  declare earnings: HasMany<typeof InvestorVehicleEarning>
}
