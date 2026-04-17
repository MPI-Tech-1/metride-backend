import VehicleModel from '#models/vehicle_model'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    const vehicleModels = [
      {
        vehicleMakeId: 1,
        name: 'Corolla',
      },
      {
        vehicleMakeId: 1,
        name: 'Camry',
      },
      {
        vehicleMakeId: 1,
        name: 'RAV4',
      },
      {
        vehicleMakeId: 2,
        name: 'Civic',
      },
      {
        vehicleMakeId: 2,
        name: 'Accord',
      },
      {
        vehicleMakeId: 2,
        name: 'CR-V',
      },
      {
        vehicleMakeId: 3,
        name: 'Focus',
      },
      {
        vehicleMakeId: 3,
        name: 'Mustang',
      },
      {
        vehicleMakeId: 3,
        name: 'Explorer',
      },
      {
        vehicleMakeId: 4,
        name: '3 Series',
      },
      {
        vehicleMakeId: 4,
        name: '5 Series',
      },
      {
        vehicleMakeId: 4,
        name: 'X5',
      },
      {
        vehicleMakeId: 5,
        name: 'C-Class',
      },
      {
        vehicleMakeId: 5,
        name: 'E-Class',
      },
      {
        vehicleMakeId: 5,
        name: 'GLA',
      },
    ]
    db.raw('SET FOREIGN_KEY_CHECKS = 0;')

    await VehicleModel.truncate()
    await VehicleModel.createMany(vehicleModels)

    db.raw('SET FOREIGN_KEY_CHECKS = 1;')
  }
}
