import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'driver_wallets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('driver_id').index()
      table.bigInteger('total_inflow_funds').defaultTo(0)
      table.bigInteger('total_outflow_funds').defaultTo(0)
      table.bigInteger('balance').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
