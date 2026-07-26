import { type HttpContext } from '@adonisjs/core/http'
import FetchNearestDriversRequestValidator from '#validators/v1/customer/booking_management/fetch_nearest_drivers_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'
import db from '@adonisjs/lucid/services/db'
import calculateMultipleDistances from '#common/helper_functions/calculate_multiple_distances'
import app from '@adonisjs/core/services/app'
import env from '#start/env'

const MAX_NEAREST_DRIVERS = 5

function calculateHaversineDistanceInMeters(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
) {
  const earthRadiusInMeters = 6_371_000
  const toRadians = (value: number) => (value * Math.PI) / 180
  const latitudeDelta = toRadians(to.latitude - from.latitude)
  const longitudeDelta = toRadians(to.longitude - from.longitude)
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2
  return Math.round(earthRadiusInMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export default class FetchNearestDriversController {
  async handle({ request, response }: HttpContext) {
    const { departure, destination } = await request.validateUsing(
      FetchNearestDriversRequestValidator
    )

    try {
      if (app.inDev && env.get('DB_CONNECTION', 'mysql') === 'sqlite') {
        const seededDrivers = await db
          .from('drivers as d')
          .join('driver_vehicles as dv', 'dv.driver_id', 'd.id')
          .join('ride_types as rt', 'rt.id', 'dv.ride_type_id')
          .leftJoin('vehicle_makes as vm', 'vm.id', 'dv.vehicle_make_id')
          .leftJoin('vehicle_models as vmo', 'vmo.id', 'dv.vehicle_model_id')
          .where('d.is_driver_active_for_trip', 1)
          .where('d.status', 'approved')
          .whereNull('d.deleted_at')
          .whereNull('dv.deleted_at')
          .select(
            'd.identifier',
            'd.first_name',
            'd.last_name',
            'd.mobile_number',
            'dv.color_of_vehicle',
            'dv.plate_number',
            'dv.seat_capacity',
            'vm.name as vehicle_make_name',
            'vmo.name as vehicle_model_name',
            'rt.price_per_kilometer',
            'rt.identifier as ride_type_identifier',
            'rt.name as ride_type_name',
            'rt.minimum_price'
          )
          .limit(MAX_NEAREST_DRIVERS)

        const tripDistanceInMeters = calculateHaversineDistanceInMeters(departure, destination)
        const tripDistanceInKilometers = tripDistanceInMeters / 1000
        const drivers = seededDrivers.map((driver, index) => {
          const driverDistanceInMeters = 800 + index * 350
          const driverDistanceInKilometers = driverDistanceInMeters / 1000
          const totalDistanceInKilometers = tripDistanceInKilometers + driverDistanceInKilometers
          const estimatedFare = Math.max(
            Number(driver.minimum_price),
            Math.round(Number(driver.price_per_kilometer) * totalDistanceInKilometers)
          )

          return {
            identifier: driver.identifier,
            firstName: driver.first_name,
            lastName: driver.last_name,
            mobileNumber: driver.mobile_number,
            rideType: {
              identfier: driver.ride_type_identifier,
              identifier: driver.ride_type_identifier,
              name: driver.ride_type_name,
            },
            driverVehicle: {
              vehiclePhotoUrl: null,
              make: driver.vehicle_make_name,
              model: driver.vehicle_model_name,
              color: driver.color_of_vehicle,
              plateNumber: driver.plate_number,
              seatCapacity: driver.seat_capacity,
            },
            currentLocation: {
              latitude: departure.latitude + 0.005 + index * 0.001,
              longitude: departure.longitude + 0.005 + index * 0.001,
            },
            driverDistance: {
              distanceInMeters: driverDistanceInMeters,
              distanceInKilometers: driverDistanceInKilometers,
              estimatedDurationInSeconds: Math.round(driverDistanceInMeters / 8.33),
            },
            tripDistance: {
              distanceInMeters: tripDistanceInMeters,
              distanceInKilometers: tripDistanceInKilometers,
              estimatedDurationInSeconds: Math.round(tripDistanceInMeters / 8.33),
            },
            totalDistanceInKilometers,
            pricePerKilometer: Number(driver.price_per_kilometer),
            estimatedFare,
          }
        })

        return response.status(HttpStatusCodesEnum.OK).send({
          status_code: HttpStatusCodesEnum.OK,
          status: SUCCESS,
          message: 'Dummy nearest drivers fetched successfully for local development.',
          results: {
            isTestData: true,
            departure,
            destination,
            drivers,
          },
        })
      }

      // Step 1: Fetch 5 nearest drivers using Haversine
      const nearestDrivers = await db
        .from('drivers as d')
        .join('driver_locations as dl', (join) => {
          join.on('dl.driver_id', '=', 'd.id').onNull('dl.deleted_at')
        })
        .join('driver_vehicles as dv', (join) => {
          join.on('dv.driver_id', '=', 'd.id').onNull('dv.deleted_at')
        })
        .join('driver_documents as dd', (join) => {
          join.on('dd.driver_id', '=', 'd.id').onNull('dd.deleted_at')
        })
        .join('ride_types as rt', (join) => {
          join.on('rt.id', '=', 'dv.ride_type_id').onNull('rt.deleted_at')
        })
        .join('vehicle_makes as vm', (join) => {
          join.on('vm.id', '=', 'dv.vehicle_make_id').onNull('vm.deleted_at')
        })
        .join('vehicle_models as vmo', (join) => {
          join.on('vmo.id', '=', 'dv.vehicle_model_id').onNull('vmo.deleted_at')
        })
        .whereRaw(
          'dl.id = (SELECT id FROM driver_locations dl2 WHERE dl2.driver_id = d.id AND dl2.deleted_at IS NULL ORDER BY dl2.created_at DESC LIMIT 1)'
        )
        .whereRaw(
          'dv.id = (SELECT id FROM driver_vehicles dv2 WHERE dv2.driver_id = d.id AND dv2.deleted_at IS NULL ORDER BY dv2.created_at DESC LIMIT 1)'
        )
        .where('d.is_driver_active_for_trip', 1)
        .where('d.status', 'approved')
        .whereNull('d.deleted_at')
        .select(
          'd.identifier',
          'd.first_name',
          'd.last_name',
          'd.mobile_number',
          'dl.latitude',
          'dl.longitude',
          'dd.vehicle_photo_url',
          'dv.color_of_vehicle',
          'dv.plate_number',
          'dv.seat_capacity',
          'vm.name as vehicle_make_name',
          'vmo.name as vehicle_model_name',
          'rt.price_per_kilometer as price_per_kilometer',
          'rt.identifier as ride_type_identfier',
          'rt.name as ride_type_name',
          'rt.minimum_price as minimum_ride_price',
          db.raw(
            `(6371000 * acos(LEAST(1, cos(radians(?)) * cos(radians(dl.latitude)) * cos(radians(dl.longitude) - radians(?)) + sin(radians(?)) * sin(radians(dl.latitude))))) AS distance_in_meters`,
            [departure.latitude, departure.longitude, departure.latitude]
          )
        )
        .orderBy('distance_in_meters', 'asc')
        .limit(MAX_NEAREST_DRIVERS)

      if (nearestDrivers.length === 0) {
        return response.status(HttpStatusCodesEnum.OK).send({
          status_code: HttpStatusCodesEnum.OK,
          status: SUCCESS,
          message: 'Nearest drivers fetched successfully.',
          results: { departure, destination, drivers: [] },
        })
      }

      // Step 2: One computeRouteMatrix call
      // destinations[0]   → departure → destination  (trip distance)
      // destinations[1–5] → departure → each driver  (pickup distance)
      const { mutatedPayload: distances } = await calculateMultipleDistances(
        `${departure.latitude},${departure.longitude}`,
        [
          `${destination.latitude},${destination.longitude}`,
          ...nearestDrivers.map((d) => `${d.latitude},${d.longitude}`),
        ]
      )

      if (!distances) {
        return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
          status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: SOMETHING_WENT_WRONG,
        })
      }

      // Index by destinationIndex for safe lookup regardless of API response ordering
      const distanceByIndex = new Map(distances.map((entry) => [entry?.destinationIndex, entry]))

      // Step 3: elements[0] → trip distance (departure → destination)
      const tripDistance = distanceByIndex.get(0)

      // Steps 4–6: elements[1..5] → driver distances, compute totals and fare
      const drivers = nearestDrivers
        .map((driver, i) => {
          const driverDistance = distanceByIndex.get(i + 1)

          if (!tripDistance || !driverDistance) return null

          const totalDistanceInKilometers =
            tripDistance.distanceInKilometers + driverDistance.distanceInKilometers

          const estimatedFare = driver.price_per_kilometer * totalDistanceInKilometers

          return {
            identifier: driver.identifier,
            firstName: driver.first_name,
            lastName: driver.last_name,
            mobileNumber: driver.mobile_number,
            rideType: {
              identfier: driver.ride_type_identfier,
              name: driver.ride_type_name,
            },
            driverVehicle: {
              vehiclePhotoUrl: driver.vehicle_photo_url,
              make: driver.vehicle_make_name,
              model: driver.vehicle_model_name,
              color: driver.color_of_vehicle,
              plateNumber: driver.plate_number,
              seatCapacity: driver.seat_capacity,
            },
            currentLocation: {
              latitude: driver.latitude,
              longitude: driver.longitude,
            },
            driverDistance: {
              distanceInMeters: driverDistance.distanceInMeters,
              distanceInKilometers: driverDistance.distanceInKilometers,
              estimatedDurationInSeconds: driverDistance.estimatedDurationInSeconds,
            },
            tripDistance: {
              distanceInMeters: tripDistance.distanceInMeters,
              distanceInKilometers: tripDistance.distanceInKilometers,
              estimatedDurationInSeconds: tripDistance.estimatedDurationInSeconds,
            },
            totalDistanceInKilometers,
            pricePerKilometer: driver.price_per_kilometer,
            estimatedFare: estimatedFare > 0 ? estimatedFare : driver.minimum_ride_price,
          }
        })
        .filter((driver) => driver !== null)

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Nearest drivers fetched successfully.',
        results: {
          departure,
          destination,
          drivers,
        },
      })
    } catch (FetchNearestDriversControllerError) {
      console.log('FetchNearestDriversControllerError -> ', FetchNearestDriversControllerError)
      await logApplicationError(FetchNearestDriversControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
