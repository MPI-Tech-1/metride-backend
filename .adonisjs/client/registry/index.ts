/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'onboarding': {
    methods: ["POST"],
    pattern: '/v1/customers/authentication/onboarding',
    tokens: [{"old":"/v1/customers/authentication/onboarding","type":0,"val":"v1","end":""},{"old":"/v1/customers/authentication/onboarding","type":0,"val":"customers","end":""},{"old":"/v1/customers/authentication/onboarding","type":0,"val":"authentication","end":""},{"old":"/v1/customers/authentication/onboarding","type":0,"val":"onboarding","end":""}],
    types: placeholder as Registry['onboarding']['types'],
  },
  'authenticate_customer': {
    methods: ["POST"],
    pattern: '/v1/customers/authentication/authenticate',
    tokens: [{"old":"/v1/customers/authentication/authenticate","type":0,"val":"v1","end":""},{"old":"/v1/customers/authentication/authenticate","type":0,"val":"customers","end":""},{"old":"/v1/customers/authentication/authenticate","type":0,"val":"authentication","end":""},{"old":"/v1/customers/authentication/authenticate","type":0,"val":"authenticate","end":""}],
    types: placeholder as Registry['authenticate_customer']['types'],
  },
  'request_account_activation_token': {
    methods: ["POST"],
    pattern: '/v1/customers/account-activation/request-token',
    tokens: [{"old":"/v1/customers/account-activation/request-token","type":0,"val":"v1","end":""},{"old":"/v1/customers/account-activation/request-token","type":0,"val":"customers","end":""},{"old":"/v1/customers/account-activation/request-token","type":0,"val":"account-activation","end":""},{"old":"/v1/customers/account-activation/request-token","type":0,"val":"request-token","end":""}],
    types: placeholder as Registry['request_account_activation_token']['types'],
  },
  'verify_account_activation_token': {
    methods: ["POST"],
    pattern: '/v1/customers/account-activation/verify-token',
    tokens: [{"old":"/v1/customers/account-activation/verify-token","type":0,"val":"v1","end":""},{"old":"/v1/customers/account-activation/verify-token","type":0,"val":"customers","end":""},{"old":"/v1/customers/account-activation/verify-token","type":0,"val":"account-activation","end":""},{"old":"/v1/customers/account-activation/verify-token","type":0,"val":"verify-token","end":""}],
    types: placeholder as Registry['verify_account_activation_token']['types'],
  },
  'request_reset_password_otp_token': {
    methods: ["POST"],
    pattern: '/v1/customers/password-management/request-otp-token',
    tokens: [{"old":"/v1/customers/password-management/request-otp-token","type":0,"val":"v1","end":""},{"old":"/v1/customers/password-management/request-otp-token","type":0,"val":"customers","end":""},{"old":"/v1/customers/password-management/request-otp-token","type":0,"val":"password-management","end":""},{"old":"/v1/customers/password-management/request-otp-token","type":0,"val":"request-otp-token","end":""}],
    types: placeholder as Registry['request_reset_password_otp_token']['types'],
  },
  'reset_password': {
    methods: ["POST"],
    pattern: '/v1/customers/password-management/reset',
    tokens: [{"old":"/v1/customers/password-management/reset","type":0,"val":"v1","end":""},{"old":"/v1/customers/password-management/reset","type":0,"val":"customers","end":""},{"old":"/v1/customers/password-management/reset","type":0,"val":"password-management","end":""},{"old":"/v1/customers/password-management/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['reset_password']['types'],
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
