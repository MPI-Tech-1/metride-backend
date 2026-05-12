type DistanceMatrixEntry = {
  destinationIndex: number
  distanceInMeters: number
  distanceInKilometers: number
  estimatedDurationInSeconds: number
} | null

type CalculateMultipleDistancesOutputOptions = {
  mutatedPayload: DistanceMatrixEntry[] | null
  infrastructureResults: Record<string, unknown>
}

export default CalculateMultipleDistancesOutputOptions
