type CalculateDistanceOutputOptions = {
  mutatedPayload: {
    distanceInKilometers: number
    distanceInMeters: number
  } | null
  infrastructureResults: Record<string, unknown>
}

export default CalculateDistanceOutputOptions
