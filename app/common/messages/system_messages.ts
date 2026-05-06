import env from '#start/env'

export const SUCCESS = 'success'
export const ERROR = 'error'
export const VALIDATION_ERROR = 'Some fields require your attention'
export const SOMETHING_WENT_WRONG = 'Something went wrong. Try again.'
export const CACHE_DATA_DOES_NOT_EXIST = 'Cache Data does not Exist'
export const CACHE_DATA_EXISTS = 'Cache Data Exists'
export const CACHE_DATA_WAS_REMOVED = 'Cache Data was Removed'
export const CACHE_DATA_WAS_NOT_REMOVED = 'Cache Data was not Removed'
export const CACHE_DATA_WAS_SAVED = 'Cache Data was Saved'
export const CACHE_DATA_WAS_NOT_SAVED = 'Cache Data was not Saved'
export const CACHE_WAS_EMPTIED = 'Cache was emptied'
export const CACHE_WAS_NOT_EMPTIED = 'Cache was not emptied'
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
