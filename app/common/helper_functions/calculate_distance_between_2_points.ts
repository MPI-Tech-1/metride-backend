import configureGeolocationProvider from '#infrastructure_providers/helpers/configure_geolocation_provider'

export default async function calculateDistanceBetween2Points(
  departureLocationGpsCoordinates: string,
  destinationLocationGpsCoordinates: string
) {
  const geolocationProvider = configureGeolocationProvider()

  const splitedDepartureLocationGpsCoordinates = departureLocationGpsCoordinates.split(',')
  const departureLongitude = Number.parseFloat(splitedDepartureLocationGpsCoordinates[0])
  const departureLatitude = Number.parseFloat(splitedDepartureLocationGpsCoordinates[1])

  const splitedDestinationLocationGpsCoordinates = destinationLocationGpsCoordinates.split(',')

  const destinationLongitude = Number.parseFloat(splitedDestinationLocationGpsCoordinates[0])
  const destinationLatitude = Number.parseFloat(splitedDestinationLocationGpsCoordinates[1])

  return await geolocationProvider.calculateDistance({
    departureLongitude,
    departureLatitude,
    destinationLongitude,
    destinationLatitude,
  })
}
