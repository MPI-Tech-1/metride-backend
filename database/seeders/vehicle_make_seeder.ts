import VehicleMake from '#models/vehicle_make'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    const vehicleMakes = [
      {
        name: 'Toyota',
      },
      {
        name: 'Honda',
      },
      {
        name: 'Ford',
      },
      {
        name: 'BMW',
      },
      {
        name: 'Mercedes-Benz',
      },
    ]
    db.raw('SET FOREIGN_KEY_CHECKS = 0;')

    await VehicleMake.truncate()
    await VehicleMake.createMany(vehicleMakes)

    db.raw('SET FOREIGN_KEY_CHECKS = 1;')
  }
}
