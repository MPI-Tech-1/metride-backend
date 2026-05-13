import { type HttpContext } from '@adonisjs/core/http'
import FetchNearestDriversRequestValidator from '#validators/v1/customer/booking_management/fetch_nearest_drivers_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'
import db from '@adonisjs/lucid/services/db'
import calculateMultipleDistances from '#common/helper_functions/calculate_multiple_distances'

const MAX_NEAREST_DRIVERS = 5

export default class FetchNearestDriversController {
  async handle({ request, response }: HttpContext) {
    const { departure, destination } = await request.validateUsing(
      FetchNearestDriversRequestValidator
    )

    try {
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
