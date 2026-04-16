import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AbstractModel from '#models/abstract_model'

export default class DriverPersonalInformation extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare cityId: number

  @column.date()
  declare dateOfBirth: DateTime

  @column()
  declare gender: string

  @column()
  declare homeAddress: string

  @column()
  declare nationalIdentificationNumber: string
}
