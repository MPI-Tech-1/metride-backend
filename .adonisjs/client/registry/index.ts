/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'customer.authentication.onboarding': {
    methods: ["POST"],
    pattern: '/v1/customers/authentication/onboarding',
    tokens: [{"old":"/v1/customers/authentication/onboarding","type":0,"val":"v1","end":""},{"old":"/v1/customers/authentication/onboarding","type":0,"val":"customers","end":""},{"old":"/v1/customers/authentication/onboarding","type":0,"val":"authentication","end":""},{"old":"/v1/customers/authentication/onboarding","type":0,"val":"onboarding","end":""}],
    types: placeholder as Registry['customer.authentication.onboarding']['types'],
  },
  'customer.authentication.authenticate_customer': {
    methods: ["POST"],
    pattern: '/v1/customers/authentication/authenticate',
    tokens: [{"old":"/v1/customers/authentication/authenticate","type":0,"val":"v1","end":""},{"old":"/v1/customers/authentication/authenticate","type":0,"val":"customers","end":""},{"old":"/v1/customers/authentication/authenticate","type":0,"val":"authentication","end":""},{"old":"/v1/customers/authentication/authenticate","type":0,"val":"authenticate","end":""}],
    types: placeholder as Registry['customer.authentication.authenticate_customer']['types'],
  },
  'customer.account-activation.request_account_activation_token': {
    methods: ["POST"],
    pattern: '/v1/customers/account-activation/request-token',
    tokens: [{"old":"/v1/customers/account-activation/request-token","type":0,"val":"v1","end":""},{"old":"/v1/customers/account-activation/request-token","type":0,"val":"customers","end":""},{"old":"/v1/customers/account-activation/request-token","type":0,"val":"account-activation","end":""},{"old":"/v1/customers/account-activation/request-token","type":0,"val":"request-token","end":""}],
    types: placeholder as Registry['customer.account-activation.request_account_activation_token']['types'],
  },
  'customer.account-activation.verify_account_activation_token': {
    methods: ["POST"],
    pattern: '/v1/customers/account-activation/verify-token',
    tokens: [{"old":"/v1/customers/account-activation/verify-token","type":0,"val":"v1","end":""},{"old":"/v1/customers/account-activation/verify-token","type":0,"val":"customers","end":""},{"old":"/v1/customers/account-activation/verify-token","type":0,"val":"account-activation","end":""},{"old":"/v1/customers/account-activation/verify-token","type":0,"val":"verify-token","end":""}],
    types: placeholder as Registry['customer.account-activation.verify_account_activation_token']['types'],
  },
  'customer.password-management.request_reset_password_otp_token': {
    methods: ["POST"],
    pattern: '/v1/customers/password-management/request-otp-token',
    tokens: [{"old":"/v1/customers/password-management/request-otp-token","type":0,"val":"v1","end":""},{"old":"/v1/customers/password-management/request-otp-token","type":0,"val":"customers","end":""},{"old":"/v1/customers/password-management/request-otp-token","type":0,"val":"password-management","end":""},{"old":"/v1/customers/password-management/request-otp-token","type":0,"val":"request-otp-token","end":""}],
    types: placeholder as Registry['customer.password-management.request_reset_password_otp_token']['types'],
  },
  'customer.password-management.reset_password': {
    methods: ["POST"],
    pattern: '/v1/customers/password-management/reset',
    tokens: [{"old":"/v1/customers/password-management/reset","type":0,"val":"v1","end":""},{"old":"/v1/customers/password-management/reset","type":0,"val":"customers","end":""},{"old":"/v1/customers/password-management/reset","type":0,"val":"password-management","end":""},{"old":"/v1/customers/password-management/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['customer.password-management.reset_password']['types'],
  },
  'driver.authentication.driver_onboarding': {
    methods: ["POST"],
    pattern: '/v1/drivers/authentication/onboarding',
    tokens: [{"old":"/v1/drivers/authentication/onboarding","type":0,"val":"v1","end":""},{"old":"/v1/drivers/authentication/onboarding","type":0,"val":"drivers","end":""},{"old":"/v1/drivers/authentication/onboarding","type":0,"val":"authentication","end":""},{"old":"/v1/drivers/authentication/onboarding","type":0,"val":"onboarding","end":""}],
    types: placeholder as Registry['driver.authentication.driver_onboarding']['types'],
  },
  'driver.authentication.authenticate_driver': {
    methods: ["POST"],
    pattern: '/v1/drivers/authentication/authenticate',
    tokens: [{"old":"/v1/drivers/authentication/authenticate","type":0,"val":"v1","end":""},{"old":"/v1/drivers/authentication/authenticate","type":0,"val":"drivers","end":""},{"old":"/v1/drivers/authentication/authenticate","type":0,"val":"authentication","end":""},{"old":"/v1/drivers/authentication/authenticate","type":0,"val":"authenticate","end":""}],
    types: placeholder as Registry['driver.authentication.authenticate_driver']['types'],
  },
  'driver.account-activation.driver_request_account_activation_token': {
    methods: ["POST"],
    pattern: '/v1/drivers/account-activation/request-token',
    tokens: [{"old":"/v1/drivers/account-activation/request-token","type":0,"val":"v1","end":""},{"old":"/v1/drivers/account-activation/request-token","type":0,"val":"drivers","end":""},{"old":"/v1/drivers/account-activation/request-token","type":0,"val":"account-activation","end":""},{"old":"/v1/drivers/account-activation/request-token","type":0,"val":"request-token","end":""}],
    types: placeholder as Registry['driver.account-activation.driver_request_account_activation_token']['types'],
  },
  'driver.account-activation.driver_verify_account_activation_token': {
    methods: ["POST"],
    pattern: '/v1/drivers/account-activation/verify-token',
    tokens: [{"old":"/v1/drivers/account-activation/verify-token","type":0,"val":"v1","end":""},{"old":"/v1/drivers/account-activation/verify-token","type":0,"val":"drivers","end":""},{"old":"/v1/drivers/account-activation/verify-token","type":0,"val":"account-activation","end":""},{"old":"/v1/drivers/account-activation/verify-token","type":0,"val":"verify-token","end":""}],
    types: placeholder as Registry['driver.account-activation.driver_verify_account_activation_token']['types'],
  },
  'driver.password-management.driver_request_reset_password_otp_token': {
    methods: ["POST"],
    pattern: '/v1/drivers/password-management/request-otp-token',
    tokens: [{"old":"/v1/drivers/password-management/request-otp-token","type":0,"val":"v1","end":""},{"old":"/v1/drivers/password-management/request-otp-token","type":0,"val":"drivers","end":""},{"old":"/v1/drivers/password-management/request-otp-token","type":0,"val":"password-management","end":""},{"old":"/v1/drivers/password-management/request-otp-token","type":0,"val":"request-otp-token","end":""}],
    types: placeholder as Registry['driver.password-management.driver_request_reset_password_otp_token']['types'],
  },
  'driver.password-management.driver_reset_password': {
    methods: ["POST"],
    pattern: '/v1/drivers/password-management/reset',
    tokens: [{"old":"/v1/drivers/password-management/reset","type":0,"val":"v1","end":""},{"old":"/v1/drivers/password-management/reset","type":0,"val":"drivers","end":""},{"old":"/v1/drivers/password-management/reset","type":0,"val":"password-management","end":""},{"old":"/v1/drivers/password-management/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['driver.password-management.driver_reset_password']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
