import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'

export default class DriverNotification extends AbstractModel {
  @column()
  declare driverId: number

  @column({ consume: (value) => value === 1 })
  declare isNotificationRead: boolean

  @column()
  declare content: string

  @column()
  declare payload: Object | string

  @column()
  declare notificationType: string
}
