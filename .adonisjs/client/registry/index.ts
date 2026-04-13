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
