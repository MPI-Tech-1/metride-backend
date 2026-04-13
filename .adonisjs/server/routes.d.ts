import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'onboarding': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'onboarding': { paramsTuple?: []; params?: {} }
  }
  GET: {
  }
  HEAD: {
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}