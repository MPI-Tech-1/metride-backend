import configureGeolocationProvider from '#infrastructure_providers/helpers/configure_geolocation_provider'

export default async function calculateMultipleDistances(
  originGpsCoordinates: string,
  destinationGpsCoordinates: string[]
) {
  const geolocationProvider = configureGeolocationProvider()

  const [originLatitude, originLongitude] = originGpsCoordinates.split(',').map(Number.parseFloat)

  const destinations = destinationGpsCoordinates.map((coords) => {
    const [latitude, longitude] = coords.split(',').map(Number.parseFloat)
    return { latitude, longitude }
  })

  return await geolocationProvider.calculateMultipleDistances({
    origin: { latitude: originLatitude, longitude: originLongitude },
    destinations,
  })
}
