import env from '#start/env'

const geolocationConfig = {
  currentProvider: env.get('CURRENT_GEOLOCATION_PROVIDER'),
}

export default geolocationConfig
