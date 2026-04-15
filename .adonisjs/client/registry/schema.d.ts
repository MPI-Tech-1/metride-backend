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
  'request_account_activation_token': {
    methods: ["POST"]
    pattern: '/v1/customers/account-activation/request-token'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/account_activation/request_account_activation_token_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/account_activation/request_account_activation_token_controller').default['handle']>>>
    }
  }
  'verify_account_activation_token': {
    methods: ["POST"]
    pattern: '/v1/customers/account-activation/verify-token'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/account_activation/customer_verify_account_activation_token_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/account_activation/customer_verify_account_activation_token_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/account_activation/verify_account_activation_token_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/account_activation/verify_account_activation_token_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'request_reset_password_otp_token': {
    methods: ["POST"]
    pattern: '/v1/customers/password-management/request-otp-token'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/password_management/customer_request_reset_password_otp_token_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/password_management/customer_request_reset_password_otp_token_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/password_management/reset_password/request_reset_password_otp_token_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/password_management/reset_password/request_reset_password_otp_token_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'reset_password': {
    methods: ["POST"]
    pattern: '/v1/customers/password-management/reset'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/password_management/customer_reset_password_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/password_management/customer_reset_password_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/password_management/reset_password/reset_password_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/password_management/reset_password/reset_password_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
