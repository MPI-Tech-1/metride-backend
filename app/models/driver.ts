import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'

export default class Driver extends AbstractModel {
  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare mobileNumber: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare fcmToken: string
}
