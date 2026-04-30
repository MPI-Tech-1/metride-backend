import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import geolocationConfig from '#config/geolocation_config'
import GeolocationFactory from '#infrastructure_providers/factories/geolocation_factory'
import type GeolocationInterface from '#infrastructure_providers/type_checkings/geolocation/geolocation_interface'

export default function configureGeolocationProvider(): GeolocationInterface {
  const provider = new GeolocationFactory(geolocationConfig.currentProvider).build()

  if (provider === SERVICE_PROVIDER_NOT_PROFILED) {
    throw new Error(SERVICE_PROVIDER_NOT_PROFILED)
  }

  return provider as GeolocationInterface
}
