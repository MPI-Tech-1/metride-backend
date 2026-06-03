import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'investor_vehicles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('investor_id').unsigned().references('id').inTable('investors').onDelete('CASCADE')
      table.string('vehicle_name')
      table.string('vehicle_type')
      table.string('plate_number').nullable()
      table.decimal('investment_amount', 15, 2).defaultTo(0)
      table.decimal('percentage_share', 5, 2).defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
