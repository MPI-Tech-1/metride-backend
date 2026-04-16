import City from '#models/city'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    const cities = [
      {
        name: 'Maiduguri',
      },
      {
        name: 'Yola',
      },
      {
        name: 'Damaturu',
      },
    ]
    db.raw('SET FOREIGN_KEY_CHECKS = 0;')

    await City.truncate()
    await City.createMany(cities)

    db.raw('SET FOREIGN_KEY_CHECKS = 1;')
  }
}
