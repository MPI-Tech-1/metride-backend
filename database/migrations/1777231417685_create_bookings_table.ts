import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('customer_id').index()
      table.integer('assigned_driver_id').nullable().index()
      table.string('type_of_booking').defaultTo('shuttle')
      table.string('departure_location_name').nullable()
      table.string('departure_location_gps_coordinates')
      table.string('departure_location_type').defaultTo('home')
      table.string('destination_location_name').nullable()
      table.string('destination_location_gps_coordinates')
      table.string('destination_location_type').defaultTo('work')
      table.integer('ride_type_id').index()
      table.boolean('is_recurring_booking').defaultTo(false)
      table.dateTime('date_of_ride')
      table.json('recurring_booking_dates')
      table.string('status').defaultTo('created')
      table.string('trip_progress').defaultTo('not-started')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
