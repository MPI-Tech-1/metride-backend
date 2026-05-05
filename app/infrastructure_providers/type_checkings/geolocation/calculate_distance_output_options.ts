type CalculateDistanceOutputOptions = {
  mutatedPayload: {
    distanceInKilometers: number
    distanceInMeters: number
    estimatedDurationInSeconds: number
  } | null
  infrastructureResults: Record<string, unknown>
}

export default CalculateDistanceOutputOptions
