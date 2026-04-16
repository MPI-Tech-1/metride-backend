import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'driver_vehicles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('driver_id').index()
      table.string('type_of_vehicle').nullable()
      table.integer('vehicle_make_id').nullable().index()
      table.integer('vehicle_model_id').nullable().index()
      table.string('color_of_vehicle').nullable()
      table.string('plate_number').nullable()
      table.integer('seat_capacity').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
