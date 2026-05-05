import { belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import { DateTime } from 'luxon'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import RideType from '#models/ride_type'
import BookingPayment from '#models/booking_payment'
import Customer from '#models/customer'
import Driver from '#models/driver'

export default class Booking extends AbstractModel {
  @column()
  declare customerId: number

  @column()
  declare assignedDriverId: number | null

  @column()
  declare typeOfBooking: 'instant' | 'shuttle'

  @column()
  declare departureLocationName: string

  @column()
  declare departureLocationGpsCoordinates: string

  @column()
  declare estimatedDurationInSeconds: number

  @column()
  declare estimatedDistanceInMeters: number

  @column({ consume: (value) => value === 1 })
  declare hasEarningBeenCreditedToDriver: boolean

  @column()
  declare departureLocationType: 'home' | 'work' | 'office' | 'mall' | 'market' | 'others'

  @column()
  declare destinationLocationName: string

  @column()
  declare destinationLocationGpsCoordinates: string

  @column()
  declare destinationLocationType: 'home' | 'work' | 'office' | 'mall' | 'market' | 'others'

  @column()
  declare rideTypeId: number

  @column()
  declare tripProgress:
    | 'not-started'
    | 'heading-to-pickup'
    | 'arrived-at-pickup'
    | 'enroute-to-dropoff'
    | 'completed'

  @column()
  declare status:
    | 'created'
    | 'assigned-a-driver'
    | 'accepted'
    | 'completed'
    | 'cancelled'
    | 'rejected'

  @column({ consume: (value) => value === 1 })
  declare isRecurringBooking: boolean

  @column.dateTime()
  declare dateOfRide: DateTime

  @column()
  declare recurringBookingDates: object

  @belongsTo(() => RideType)
  declare rideType: BelongsTo<typeof RideType>

  @hasOne(() => BookingPayment)
  declare bookingPayment: HasOne<typeof BookingPayment>

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => Driver, {
    foreignKey: 'assignedDriverId',
  })
  declare assignedDriver: BelongsTo<typeof Driver>
}
