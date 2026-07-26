import { column, computed, hasMany } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import InvestorVehicle from '#models/investor_vehicle'

export default class Investor extends AbstractModel {
  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare mobileNumber: string

  @column()
  declare address: string | null

  @computed()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  @hasMany(() => InvestorVehicle)
  declare investorVehicles: HasMany<typeof InvestorVehicle>
}
