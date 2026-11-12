import { BaseSchema } from '@adonisjs/lucid/schema'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('driver_online_sessions', (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('driver_id').notNullable().index()
      table.timestamp('started_at').notNullable().index()
      table.timestamp('ended_at').nullable().index()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })

    this.schema.createTable('driver_booking_assignments', (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('driver_id').notNullable().index()
      table.integer('booking_id').notNullable().index()
      table.timestamp('assigned_at').notNullable().index()
      table.timestamp('responded_at').nullable()
      // pending | accepted | rejected | reassigned | cancelled
      table.string('response').notNullable().defaultTo('pending')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })

    this.schema.createTable('driver_online_reward_settings', (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.boolean('is_enabled').notNullable().defaultTo(false)
      table.string('window_start_time', 5).notNullable().defaultTo('07:00')
      table.string('window_end_time', 5).notNullable().defaultTo('09:00')
      table.bigInteger('reward_amount').notNullable().defaultTo(0)
      table.integer('grace_minutes').notNullable().defaultTo(5)
      table.integer('acceptance_timeout_minutes').notNullable().defaultTo(5)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })

    this.schema.createTable('driver_online_rewards', (table) => {
      table.increments('id')
      table.string('identifier').index()
      table.integer('driver_id').notNullable().index()
      table.date('reward_date').notNullable().index()
      table.string('window_start_time', 5).notNullable()
      table.string('window_end_time', 5).notNullable()
      table.integer('online_minutes').notNullable()
      table.bigInteger('amount').notNullable()
      table.integer('driver_wallet_transaction_id').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
      table.unique(['driver_id', 'reward_date'])
    })

    this.defer(async (db) => {
      // Formatted like Lucid writes timestamps, so every database driver reads it back.
      const now = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
      await db.table('driver_online_reward_settings').insert({
        identifier: randomUUID(),
        is_enabled: false,
        window_start_time: '07:00',
        window_end_time: '09:00',
        reward_amount: 0,
        grace_minutes: 5,
        acceptance_timeout_minutes: 5,
        created_at: now,
        updated_at: now,
      })
    })
  }

  async down() {
    this.schema.dropTable('driver_online_rewards')
    this.schema.dropTable('driver_online_reward_settings')
    this.schema.dropTable('driver_booking_assignments')
    this.schema.dropTable('driver_online_sessions')
  }
}
