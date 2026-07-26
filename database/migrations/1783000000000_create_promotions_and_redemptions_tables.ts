import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('promotions', (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.string('code').notNullable().unique()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('discount_type').notNullable()
      table.bigInteger('discount_value').notNullable()
      table.bigInteger('maximum_discount_amount').nullable()
      table.bigInteger('minimum_booking_amount').defaultTo(0)
      table.integer('global_usage_limit').nullable()
      table.integer('usage_limit_per_customer').defaultTo(1)
      table.string('applicable_booking_type').defaultTo('all')
      table.timestamp('starts_at').nullable()
      table.timestamp('ends_at').nullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })

    this.schema.alterTable('booking_payments', (table) => {
      table.integer('promotion_id').nullable().index()
      table.string('promotion_code').nullable()
      table.bigInteger('amount_due').nullable()
    })

    this.schema.createTable('promotion_redemptions', (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('promotion_id').notNullable().index()
      table.integer('customer_id').notNullable().index()
      table.integer('booking_id').notNullable().unique()
      table.integer('booking_payment_id').notNullable().index()
      table.bigInteger('base_amount').notNullable()
      table.bigInteger('discount_amount').notNullable()
      table.string('status').defaultTo('reserved')
      table.timestamp('redeemed_at').nullable()
      table.timestamp('released_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable('promotion_redemptions')
    this.schema.alterTable('booking_payments', (table) => {
      table.dropColumn('promotion_id')
      table.dropColumn('promotion_code')
      table.dropColumn('amount_due')
    })
    this.schema.dropTable('promotions')
  }
}
