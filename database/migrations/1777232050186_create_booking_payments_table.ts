import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'booking_payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('booking_id').index()
      table.integer('base_price').defaultTo(0)
      table.string('system_generated_provider_reference').nullable()
      table.string('payment_provider_reference').nullable()
      table.string('payment_method').defaultTo('card')
      table.string('payment_status').defaultTo('pending')
      table.integer('discount_amount').defaultTo(0)
      table.integer('amount_paid').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
