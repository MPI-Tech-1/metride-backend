import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import MockGeolocationProvider from '#infrastructure_providers/externals/geolocation/mock_geolocation_provider'
import type GeolocationInterface from '#infrastructure_providers/type_checkings/geolocation/geolocation_interface'

export default class GeolocationFactory {
  constructor(private provider: string) {}

  public build(): GeolocationInterface | string {
    if (this.provider === 'mock') return new MockGeolocationProvider()

    return SERVICE_PROVIDER_NOT_PROFILED
  }
}
