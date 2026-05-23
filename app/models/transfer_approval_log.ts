import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'

export default class TransferApprovalLog extends AbstractModel {
  @column()
  declare provider: string

  @column()
  declare logs: Object | string
}
