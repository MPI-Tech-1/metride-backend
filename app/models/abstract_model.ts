import { BaseModel, beforeCreate, beforeFetch, beforeFind, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
// import { cuid } from '@adonisjs/core/helpers'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class AbstractModel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare identifier: string

  @column.dateTime({
    autoCreate: true,
    serialize: (dateValue: DateTime | null) => {
      return dateValue
        ? dateValue.setZone('Africa/Lagos').toLocaleString(DateTime.DATETIME_FULL)
        : dateValue
    },
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (dateValue: DateTime | null) => {
      return dateValue
        ? dateValue.setZone('Africa/Lagos').toLocaleString(DateTime.DATETIME_FULL)
        : dateValue
    },
  })
  declare updatedAt: DateTime

  @column.dateTime({
    serialize: (dateValue: DateTime | null) => {
      return dateValue
        ? dateValue.setZone('Africa/Lagos').toLocaleString(DateTime.DATETIME_FULL)
        : dateValue
    },
  })
  declare deletedAt: DateTime | null

  public async softDelete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }

  @beforeFind()
  public static softDeletesFind = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
    query.whereNull('deleted_at')
  }

  @beforeFetch()
  public static softDeletesFetch = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
    query.whereNull('deleted_at')
  }

  @beforeCreate()
  public static async generateIdentifier(model: AbstractModel) {
    model.identifier = this.cuid()
  }

  private static cuid(): string {
    return ''
  }
}
