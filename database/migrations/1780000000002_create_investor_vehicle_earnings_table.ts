import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'investor_vehicle_earnings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('investor_id').index()
      table.integer('investor_vehicle_id').index()
      table.integer('amount').defaultTo(0)
      table.string('status').defaultTo('pending')
      table.string('description').nullable()
      table.timestamp('paid_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
