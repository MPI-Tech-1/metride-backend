import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('mvest_owners', (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable().unique()
      table.string('mobile_number').notNullable()
      table.string('password').notNullable()
      table.string('status').defaultTo('active')
      table.string('bank_name').nullable()
      table.string('account_name').nullable()
      table.string('account_number').nullable()
      table.timestamp('last_logged_in_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })

    this.schema.createTable('mvest_vehicle_agreements', (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('mvest_owner_id').notNullable().index()
      table.integer('driver_vehicle_id').notNullable().index()
      table.decimal('commission_percentage', 5, 2).notNullable()
      table.timestamp('starts_at').notNullable()
      table.timestamp('ends_at').nullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })

    this.schema.createTable('mvest_earnings', (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('booking_id').notNullable().unique()
      table.integer('mvest_owner_id').notNullable().index()
      table.integer('mvest_vehicle_agreement_id').notNullable().index()
      table.integer('driver_vehicle_id').notNullable().index()
      table.bigInteger('eligible_amount').notNullable()
      table.decimal('commission_percentage', 5, 2).notNullable()
      table.bigInteger('commission_amount').notNullable()
      table.string('status').defaultTo('pending')
      table.timestamp('paid_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })

    this.schema.alterTable('bookings', (table) => {
      table.integer('driver_vehicle_id').nullable().index()
    })
  }

  async down() {
    this.schema.alterTable('bookings', (table) => {
      table.dropColumn('driver_vehicle_id')
    })
    this.schema.dropTable('mvest_earnings')
    this.schema.dropTable('mvest_vehicle_agreements')
    this.schema.dropTable('mvest_owners')
  }
}
