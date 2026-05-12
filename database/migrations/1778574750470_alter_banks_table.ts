import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'banks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('bank_code').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('bank_code')
    })
  }
}
