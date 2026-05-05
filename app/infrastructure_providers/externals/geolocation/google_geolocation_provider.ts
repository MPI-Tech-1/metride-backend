import geolocationConfig from '#config/geolocation_config'
import HttpClient from '#infrastructure_providers/internals/http_client'
import type CalculateDistanceInputOptions from '#infrastructure_providers/type_checkings/geolocation/calculate_distance_input_options'
import type CalculateDistanceOutputOptions from '#infrastructure_providers/type_checkings/geolocation/calculate_distance_output_options'
import type GeolocationInterface from '#infrastructure_providers/type_checkings/geolocation/geolocation_interface'

export default class GoogleGeolocationProvider implements GeolocationInterface {
  private endpointUrl: string = geolocationConfig.google.endpoint
  private apiKey: string = geolocationConfig.google.apiKey

  public async calculateDistance(
    calculateDistanceInputOptions: CalculateDistanceInputOptions
  ): Promise<CalculateDistanceOutputOptions> {
    const { departureLongitude, departureLatitude, destinationLongitude, destinationLatitude } =
      calculateDistanceInputOptions
    try {
      const { apiResponse } = await HttpClient.post({
        endpointUrl: this.endpointUrl,
        dataPayload: {
          origin: {
            location: {
              latLng: { latitude: departureLatitude, longitude: departureLongitude },
            },
          },
          destination: {
            location: {
              latLng: { latitude: destinationLatitude, longitude: destinationLongitude },
            },
          },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
        },
        headerOptions: {
          headers: {
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
          },
        },
      })

      if (!apiResponse.routes || apiResponse.routes.length === 0) {
        return {
          mutatedPayload: null,
          infrastructureResults: {},
        }
      }

      const route = apiResponse.routes[0]
      const distanceInMeters: number = route.distanceMeters
      const distanceInKilometers: number = distanceInMeters / 1000
      const estimatedDurationInSeconds: number = Number.parseInt(route.duration, 10)

      return {
        mutatedPayload: {
          estimatedDurationInSeconds,
          distanceInKilometers,
          distanceInMeters,
        },
        infrastructureResults: {},
      }
    } catch (calculateDistanceError) {
      console.log('GoogleGeolocationProvider.calculateDistance => ', calculateDistanceError)
      return {
        mutatedPayload: null,
        infrastructureResults: {},
      }
    }
  }
}
