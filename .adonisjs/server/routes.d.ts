import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'onboarding': { paramsTuple?: []; params?: {} }
    'authenticate_customer': { paramsTuple?: []; params?: {} }
    'request_account_activation_token': { paramsTuple?: []; params?: {} }
    'verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'reset_password': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'onboarding': { paramsTuple?: []; params?: {} }
    'authenticate_customer': { paramsTuple?: []; params?: {} }
    'request_account_activation_token': { paramsTuple?: []; params?: {} }
    'verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'reset_password': { paramsTuple?: []; params?: {} }
  }
  GET: {
  }
  HEAD: {
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}