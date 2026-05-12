import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'driver_bank_accounts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('payout_provider_identifier').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('payout_provider_identifier')
    })
  }
}
