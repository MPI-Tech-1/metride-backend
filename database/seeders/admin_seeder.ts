import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Admin from '#models/admin'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
    const password = 'password'

    const hashedPassword = await hash.make(password)

    const admins = [
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@metride.app',
        password: hashedPassword,
      },
      {
        firstName: 'Normal',
        lastName: 'Admin',
        email: 'normaladmin@metride.app',
        password: hashedPassword,
      }
    ]

    db.raw('SET FOREIGN_KEY_CHECKS = 0;')

    await Admin.truncate()

    await Admin.createMany(admins)

    db.raw('SET FOREIGN_KEY_CHECKS = 1;')
  }
}
