/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'onboarding': {
    methods: ["POST"]
    pattern: '/v1/customers/authentication/onboarding'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/authentication/customer_onboarding_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/authentication/customer_onboarding_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/authentication/onboarding_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/authentication/onboarding_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'authenticate_customer': {
    methods: ["POST"]
    pattern: '/v1/customers/authentication/authenticate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/authentication/customer_authenticate_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/authentication/customer_authenticate_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/authentication/authenticate_customer_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/authentication/authenticate_customer_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
