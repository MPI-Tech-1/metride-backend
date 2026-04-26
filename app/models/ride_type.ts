import { column } from "@adonisjs/lucid/orm"
import AbstractModel from '#models/abstract_model'


export default class RideType extends AbstractModel {
  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare numberOfSeats: number

  @column()
  declare pricePerKilometer: number

  @column()
  declare basePrice: number

  @column()
  declare minimumPrice: number
}
