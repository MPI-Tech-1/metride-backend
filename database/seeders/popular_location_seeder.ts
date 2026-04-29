import PopularLocation from '#models/popular_location'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    const popularLocations = [
      {
        cityId: 1,
        name: 'Borno State University',
        gpsCoordinates: '11.8347, 13.1538',
        typeOfLocation: 'school',
        isActive: true,
      },
      {
        cityId: 1,
        name: 'University of Maiduguri',
        gpsCoordinates: '11.8464, 13.1603',
        typeOfLocation: 'school',
        isActive: true,
      },
      {
        cityId: 1,
        name: 'Monday Market',
        gpsCoordinates: '11.8333, 13.1500',
        typeOfLocation: 'market',
        isActive: true,
      },
      {
        cityId: 1,
        name: 'Custom Market',
        gpsCoordinates: '11.8206, 13.1432',
        typeOfLocation: 'market',
        isActive: true,
      },
      {
        cityId: 1,
        name: 'Maiduguri International Airport',
        gpsCoordinates: '11.8558, 13.0809',
        typeOfLocation: 'airport',
        isActive: true,
      },
      {
        cityId: 1,
        name: 'University of Maiduguri Teaching Hospital (UMTH)',
        gpsCoordinates: '11.8339, 13.1422',
        typeOfLocation: 'hospital',
        isActive: true,
      },
      {
        cityId: 1,
        name: 'Polo Ground Maiduguri',
        gpsCoordinates: '11.8320, 13.1450',
        typeOfLocation: 'recreation',
        isActive: true,
      },
      {
        cityId: 1,
        name: 'Baga Road',
        gpsCoordinates: '11.8600, 13.1500',
        typeOfLocation: 'landmark',
        isActive: true,
      },
      {
        cityId: 1,
        name: 'Post Office Area',
        gpsCoordinates: '11.8311, 13.1515',
        typeOfLocation: 'business',
        isActive: true,
      },
      {
        cityId: 1,
        name: 'Kashim Ibrahim Way',
        gpsCoordinates: '11.8295, 13.1482',
        typeOfLocation: 'landmark',
        isActive: true,
      },
    ]

    await db.rawQuery('SET FOREIGN_KEY_CHECKS = 0;')

    await PopularLocation.truncate()
    await PopularLocation.createMany(popularLocations)

    await db.rawQuery('SET FOREIGN_KEY_CHECKS = 1;')
  }
}
