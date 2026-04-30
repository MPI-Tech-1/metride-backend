import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'

export default class CustomerNotification extends AbstractModel {
  @column()
  declare customerId: number

  @column({ consume: (value) => value === 1 })
  declare isNotificationRead: boolean

  @column()
  declare content: string

  @column()
  declare payload: Object | string

  @column()
  declare notificationType: string
}
