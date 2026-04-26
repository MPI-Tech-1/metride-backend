import RideType from '#models/ride_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    const rideTypes = [
      {
        name: 'Car',
        description: '4-seater comfortable air-conditioned vehicle',
        numberOfSeats: 4,
        pricePerKilometer: 250000,
        basePrice: 100000,
        minimumPrice: 150000,
      },
      {
        name: 'Keke Napep',
        description: '3-seater tricycle, affordable for short trips',
        numberOfSeats: 3,
        pricePerKilometer: 120000,
        basePrice: 300000,
        minimumPrice: 50000,
      },
      {
        name: 'Bus',
        description: '8–14 seater bus for group transportation',
        numberOfSeats: 10,
        pricePerKilometer: 40000,
        basePrice: 200000,
        minimumPrice: 30000,
      }
    ]

    db.raw('SET FOREIGN_KEY_CHECKS = 0;')

    await RideType.truncate()
    await RideType.createMany(rideTypes)

    db.raw('SET FOREIGN_KEY_CHECKS = 1;')
  }
}
