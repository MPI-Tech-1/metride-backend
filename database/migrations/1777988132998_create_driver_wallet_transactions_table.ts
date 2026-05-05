import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'driver_wallet_transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('driver_id').index()
      table.bigInteger('driver_wallet_id').defaultTo(0)
      table.bigInteger('amount').defaultTo(0)
      table.string('system_generated_transaction_reference')
      table.string('provider_transaction_reference').nullable()
      table.string('remark')
      table.string('type_of_transaction').defaultTo('credit')
      table.string('status').defaultTo('pending')
      table.json('transaction_logs')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
