import { belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'
import { DateTime } from 'luxon'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import RideType from '#models/ride_type'
import BookingPayment from '#models/booking_payment'
import Customer from '#models/customer'

export default class Booking extends AbstractModel {
  @column()
  declare customerId: number

  @column()
  declare typeOfBooking: 'instant' | 'shuttle'

  @column()
  declare departureLocationName: string

  @column()
  declare departureLocationGpsCoordinates: string

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
}
