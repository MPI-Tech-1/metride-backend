import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'driver_registration_steps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('customer_id')
      table.boolean('has_activated_account').defaultTo(false)
      table.boolean('has_provided_personal_information').defaultTo(false)
      table.boolean('has_provided_vehicle_information').defaultTo(false)
      table.boolean('has_provided_required_documents').defaultTo(false)
      table.boolean('has_provided_bank_account').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
