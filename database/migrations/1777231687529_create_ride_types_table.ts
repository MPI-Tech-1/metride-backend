import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ride_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.string('name')
      table.text('description').nullable()
      table.integer('number_of_seats').defaultTo(1)
      table.integer('price_per_kilometer').defaultTo(0)
      table.integer('base_price').defaultTo(0)
      table.integer('minimum_price').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
