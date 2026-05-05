import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'driver_wallet_withdrawal_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('driver_id').index()
      table.bigInteger('driver_wallet_id').index('driver_wallet_id_index')
      table.bigInteger('amount').defaultTo(0)
      table.string('status').defaultTo('pending')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
