import type CalculateDistanceInputOptions from '#infrastructure_providers/type_checkings/geolocation/calculate_distance_input_options'
import type CalculateDistanceOutputOptions from '#infrastructure_providers/type_checkings/geolocation/calculate_distance_output_options'
import type GeolocationInterface from '#infrastructure_providers/type_checkings/geolocation/geolocation_interface'

export default class MockGeolocationProvider implements GeolocationInterface {
  public async calculateDistance(
    calculateDistanceInputOptions: CalculateDistanceInputOptions
  ): Promise<CalculateDistanceOutputOptions> {
    console.log('calculateDistanceInputOptions => ', calculateDistanceInputOptions)
    return Promise.resolve({
      mutatedPayload: {
        distanceInKilometers: 10,
        distanceInMeters: 10000,
        estimatedDurationInSeconds: 300,
      },
      infrastructureResults: {},
    })
  }
}
