import City from '#models/city'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    const cities = [
      {
        name: 'Maiduguri',
        latitude: '11.8333',
        longitude: '13.15',
      },
      {
        name: 'Yola',
        latitude: '9.2035',
        longitude: '12.4954',
      },
      {
        name: 'Damaturu',
        latitude: '11.747',
        longitude: '11.9608',
      },
    ]

    await db.rawQuery('SET FOREIGN_KEY_CHECKS = 0;')
    await City.truncate()
    await City.createMany(cities)
    await db.rawQuery('SET FOREIGN_KEY_CHECKS = 1;')
  }
}
