import env from '#start/env'

export const SUCCESS = 'success'
export const ERROR = 'error'
export const VALIDATION_ERROR = 'Some fields require your attention'
export const SOMETHING_WENT_WRONG = 'Something went wrong. Try again.'
export const ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES = env.get(
  'ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES'
)
export const OTP_TOKEN_EXPIRATION_TIMEFRAME_IN_MINUTES = env.get(
  'OTP_TOKEN_EXPIRATION_TIMEFRAME_IN_MINUTES'
)
export const SERVICE_PROVIDER_NOT_PROFILED = 'Service Provider Not Profiled'

export const DATE_TIME_FORMAT = env.get('DATE_TIME_FORMAT')
export const DATE_FORMAT = env.get('DATE_FORMAT')
export const METRIDE_ADMIN_DASHBOARD_URL = env.get('METRIDE_ADMIN_DASHBOARD_URL')
