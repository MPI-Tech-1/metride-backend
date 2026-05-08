import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cities'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('longitude').nullable()
      table.string('latitude').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('longitude')
      table.dropColumn('latitude')
    })
  }
}
