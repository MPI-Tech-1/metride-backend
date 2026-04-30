import type CalculateDistanceInputOptions from '#infrastructure_providers/type_checkings/geolocation/calculate_distance_input_options'
import type CalculateDistanceOutputOptions from '#infrastructure_providers/type_checkings/geolocation/calculate_distance_output_options'

interface GeolocationInterface {
  calculateDistance(
    calculateDistanceInputOptions: CalculateDistanceInputOptions
  ): Promise<CalculateDistanceOutputOptions>
}

export default GeolocationInterface
