import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'

export default class City extends AbstractModel {
  @column()
  declare name: string
}
