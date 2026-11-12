import AbstractModel from '#models/abstract_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export type DriverBookingAssignmentResponse =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'reassigned'
  | 'cancelled'

export default class DriverBookingAssignment extends AbstractModel {
  @column()
  declare driverId: number

  @column()
  declare bookingId: number

  @column.dateTime()
  declare assignedAt: DateTime

  @column.dateTime()
  declare respondedAt: DateTime | null

  @column()
  declare response: DriverBookingAssignmentResponse
}
