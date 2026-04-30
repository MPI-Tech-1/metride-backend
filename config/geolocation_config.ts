import env from '#start/env'

const geolocationConfig = {
  currentProvider: env.get('CURRENT_GEOLOCATION_PROVIDER'),
  google: {
    identifier: 'google',
    apiKey: env.get('GOOGLE_GEOLOCATION_PROVIDER_API_KEY'),
    endpoint: env.get('GOOGLE_GEOLOCATION_PROVIDER_ENDPOINT'),
  },
}

export default geolocationConfig
