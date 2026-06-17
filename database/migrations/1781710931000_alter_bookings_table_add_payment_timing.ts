import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('payment_timing').notNullable().defaultTo('pay_now')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('payment_timing')
    })
  }
}
