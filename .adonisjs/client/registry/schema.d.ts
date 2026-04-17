/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'customer.authentication.onboarding': {
    methods: ["POST"]
    pattern: '/api/v1/customers/authentication/onboarding'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/authentication/customer_onboarding_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/authentication/customer_onboarding_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/authentication/onboarding_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/authentication/onboarding_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'customer.authentication.authenticate_customer': {
    methods: ["POST"]
    pattern: '/api/v1/customers/authentication/authenticate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/authentication/customer_authenticate_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/authentication/customer_authenticate_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/authentication/authenticate_customer_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/authentication/authenticate_customer_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'customer.account-activation.request_account_activation_token': {
    methods: ["POST"]
    pattern: '/api/v1/customers/account-activation/request-token'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/account_activation/request_account_activation_token_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/account_activation/request_account_activation_token_controller').default['handle']>>>
    }
  }
  'customer.account-activation.verify_account_activation_token': {
    methods: ["POST"]
    pattern: '/api/v1/customers/account-activation/verify-token'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/account_activation/customer_verify_account_activation_token_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/account_activation/customer_verify_account_activation_token_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/account_activation/verify_account_activation_token_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/account_activation/verify_account_activation_token_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'customer.password-management.request_reset_password_otp_token': {
    methods: ["POST"]
    pattern: '/api/v1/customers/password-management/request-otp-token'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/password_management/customer_request_reset_password_otp_token_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/password_management/customer_request_reset_password_otp_token_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/password_management/reset_password/request_reset_password_otp_token_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/password_management/reset_password/request_reset_password_otp_token_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'customer.password-management.reset_password': {
    methods: ["POST"]
    pattern: '/api/v1/customers/password-management/reset'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/password_management/customer_reset_password_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/password_management/customer_reset_password_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/password_management/reset_password/reset_password_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/password_management/reset_password/reset_password_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.authentication.driver_onboarding': {
    methods: ["POST"]
    pattern: '/api/v1/drivers/authentication/onboarding'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/driver/authentication/driver_onboarding_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/driver/authentication/driver_onboarding_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/authentication/onboarding_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/authentication/onboarding_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.authentication.authenticate_driver': {
    methods: ["POST"]
    pattern: '/api/v1/drivers/authentication/authenticate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/driver/authentication/driver_authenticate_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/driver/authentication/driver_authenticate_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/authentication/authenticate_driver_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/authentication/authenticate_driver_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.account-activation.driver_request_account_activation_token': {
    methods: ["POST"]
    pattern: '/api/v1/drivers/account-activation/request-token'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/account_activation/request_account_activation_token_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/account_activation/request_account_activation_token_controller').default['handle']>>>
    }
  }
  'driver.account-activation.driver_verify_account_activation_token': {
    methods: ["POST"]
    pattern: '/api/v1/drivers/account-activation/verify-token'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/driver/account_activation/driver_verify_account_activation_token_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/driver/account_activation/driver_verify_account_activation_token_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/account_activation/verify_account_activation_token_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/account_activation/verify_account_activation_token_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.password-management.driver_request_reset_password_otp_token': {
    methods: ["POST"]
    pattern: '/api/v1/drivers/password-management/request-otp-token'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/driver/password_management/driver_request_reset_password_otp_token_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/driver/password_management/driver_request_reset_password_otp_token_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/password_management/reset_password/request_reset_password_otp_token_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/password_management/reset_password/request_reset_password_otp_token_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.password-management.driver_reset_password': {
    methods: ["POST"]
    pattern: '/api/v1/drivers/password-management/reset'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/driver/password_management/driver_reset_password_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/driver/password_management/driver_reset_password_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/password_management/reset_password/reset_password_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/password_management/reset_password/reset_password_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.profile.get_personal_information': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/drivers/profile/personal-information'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/personal_information/get_personal_information_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/personal_information/get_personal_information_controller').default['handle']>>>
    }
  }
  'driver.profile.update_personal_information': {
    methods: ["PATCH"]
    pattern: '/api/v1/drivers/profile/personal-information'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/driver/profile/personal_information/update_personal_information_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/driver/profile/personal_information/update_personal_information_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/personal_information/update_personal_information_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/personal_information/update_personal_information_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.profile.get_vehicle_information': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/drivers/profile/vehicle-information'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/vehicle_information/get_vehicle_information_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/vehicle_information/get_vehicle_information_controller').default['handle']>>>
    }
  }
  'driver.profile.update_vehicle_information': {
    methods: ["PATCH"]
    pattern: '/api/v1/drivers/profile/vehicle-information'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/driver/profile/vehicle_information/update_vehicle_information_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/driver/profile/vehicle_information/update_vehicle_information_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/vehicle_information/update_vehicle_information_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/vehicle_information/update_vehicle_information_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.profile.get_bank_account': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/drivers/profile/bank-account'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/bank_account/get_bank_account_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/bank_account/get_bank_account_controller').default['handle']>>>
    }
  }
  'driver.profile.update_bank_account': {
    methods: ["PATCH"]
    pattern: '/api/v1/drivers/profile/bank-account'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/driver/profile/bank_account/update_bank_account_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/driver/profile/bank_account/update_bank_account_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/bank_account/update_bank_account_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/bank_account/update_bank_account_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.profile.get_documents': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/drivers/profile/documents'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/documents/get_documents_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/documents/get_documents_controller').default['handle']>>>
    }
  }
  'driver.profile.update_documents': {
    methods: ["PATCH"]
    pattern: '/api/v1/drivers/profile/documents'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/driver/profile/documents/update_documents_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/driver/profile/documents/update_documents_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/documents/update_documents_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/profile/documents/update_documents_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'common.location.fetch_cities': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/common/location/cities'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/common/location/fetch_cities_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/common/location/fetch_cities_controller').default['handle']>>>
    }
  }
  'common.finance.fetch_banks': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/common/finance/banks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/common/finance/fetch_banks_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/common/finance/fetch_banks_controller').default['handle']>>>
    }
  }
  'common.vehicle.fetch_vehicle_models': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/common/vehicle/vehicle-models'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'common.vehicle.fetch_vehicle_makes_controllers': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/common/vehicle/vehicle-makes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'common.media.upload_image': {
    methods: ["POST"]
    pattern: '/api/v1/common/media/image'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/common/media/upload_image_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/common/media/upload_image_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/common/media/upload_image_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/common/media/upload_image_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
