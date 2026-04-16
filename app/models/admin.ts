import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'

export default class Admin extends AbstractModel {
  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string
}
