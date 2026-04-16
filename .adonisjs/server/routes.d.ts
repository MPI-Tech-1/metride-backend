import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'customer.authentication.onboarding': { paramsTuple?: []; params?: {} }
    'customer.authentication.authenticate_customer': { paramsTuple?: []; params?: {} }
    'customer.account-activation.request_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.account-activation.verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.reset_password': { paramsTuple?: []; params?: {} }
    'driver.authentication.driver_onboarding': { paramsTuple?: []; params?: {} }
    'driver.authentication.authenticate_driver': { paramsTuple?: []; params?: {} }
    'driver.account-activation.driver_request_account_activation_token': { paramsTuple?: []; params?: {} }
    'driver.account-activation.driver_verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'driver.password-management.driver_request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'driver.password-management.driver_reset_password': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'customer.authentication.onboarding': { paramsTuple?: []; params?: {} }
    'customer.authentication.authenticate_customer': { paramsTuple?: []; params?: {} }
    'customer.account-activation.request_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.account-activation.verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.reset_password': { paramsTuple?: []; params?: {} }
    'driver.authentication.driver_onboarding': { paramsTuple?: []; params?: {} }
    'driver.authentication.authenticate_driver': { paramsTuple?: []; params?: {} }
    'driver.account-activation.driver_request_account_activation_token': { paramsTuple?: []; params?: {} }
    'driver.account-activation.driver_verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'driver.password-management.driver_request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'driver.password-management.driver_reset_password': { paramsTuple?: []; params?: {} }
  }
  GET: {
  }
  HEAD: {
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}