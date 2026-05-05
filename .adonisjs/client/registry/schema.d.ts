/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'admin.authentication.authenticate_admin': {
    methods: ["POST"]
    pattern: '/api/v1/admins/authentication/authenticate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/admin/authentication/admin_authenticate_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/admin/authentication/admin_authenticate_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/authentication/authenticate_admin_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/authentication/authenticate_admin_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.customer_management.customers.fetch_customers': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admins/customer-management/customers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/v1/admin/customer_management/list_customers_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/customer_management/fetch_customers_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/customer_management/fetch_customers_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.customer_management.customers.get_customer': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admins/customer-management/customers/:identifier'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/customer_management/get_customer_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/customer_management/get_customer_controller').default['handle']>>>
    }
  }
  'admin.driver_management.fetch_drivers': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admins/driver-management/drivers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/v1/admin/driver_management/list_drivers_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/driver_management/fetch_drivers_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/driver_management/fetch_drivers_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.driver_management.get_driver': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admins/driver-management/drivers/:identifier'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/driver_management/get_driver_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/driver_management/get_driver_controller').default['handle']>>>
    }
  }
  'admin.driver_management.approve_driver': {
    methods: ["POST"]
    pattern: '/api/v1/admins/driver-management/drivers/:identifier/approve'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/driver_management/approve_driver_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/driver_management/approve_driver_controller').default['handle']>>>
    }
  }
  'admin.driver_management.reject_driver': {
    methods: ["POST"]
    pattern: '/api/v1/admins/driver-management/drivers/:identifier/reject'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/admin/driver_management/reject_driver_request_validator').default)>>
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/admin/driver_management/reject_driver_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/driver_management/reject_driver_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/driver_management/reject_driver_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.settings.create_ride_type': {
    methods: ["POST"]
    pattern: '/api/v1/admins/settings/booking/ride-types'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/admin/settings/booking/ride_types/create_ride_type_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/admin/settings/booking/ride_types/create_ride_type_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/ride_types/create_ride_type_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/ride_types/create_ride_type_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.settings.update_ride_type': {
    methods: ["PATCH"]
    pattern: '/api/v1/admins/settings/booking/ride-types/:identifier'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/admin/settings/booking/ride_types/update_ride_type_request_validator').default)>>
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/admin/settings/booking/ride_types/update_ride_type_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/ride_types/update_ride_type_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/ride_types/update_ride_type_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.settings.fetch_ride_types': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admins/settings/booking/ride-types'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/ride_types/fetch_ride_types_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/ride_types/fetch_ride_types_controller').default['handle']>>>
    }
  }
  'admin.settings.get_ride_type': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admins/settings/booking/ride-types/:identifier'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/ride_types/get_ride_type_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/ride_types/get_ride_type_controller').default['handle']>>>
    }
  }
  'admin.settings.create_popular_location': {
    methods: ["POST"]
    pattern: '/api/v1/admins/settings/booking/popular-locations'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/admin/settings/booking/popular_locations/create_popular_location_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/admin/settings/booking/popular_locations/create_popular_location_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/popular_locations/create_popular_location_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/popular_locations/create_popular_location_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.settings.update_popular_location': {
    methods: ["PATCH"]
    pattern: '/api/v1/admins/settings/booking/popular-locations/:identifier'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/admin/settings/booking/popular_locations/update_popular_location_request_validator').default)>>
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/admin/settings/booking/popular_locations/update_popular_location_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/popular_locations/update_popular_location_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/popular_locations/update_popular_location_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.settings.fetch_popular_locations': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admins/settings/booking/popular-locations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/popular_locations/fetch_popular_locations_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/popular_locations/fetch_popular_locations_controller').default['handle']>>>
    }
  }
  'admin.settings.get_popular_location': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admins/settings/booking/popular-locations/:identifier'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/popular_locations/get_popular_location_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/settings/booking/popular_locations/get_popular_location_controller').default['handle']>>>
    }
  }
  'admin.bookings.fetch_bookings': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admins/bookings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/v1/admin/booking_management/list_bookings_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/booking_management/fetch_bookings_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/booking_management/fetch_bookings_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.bookings.get_booking': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admins/bookings/:identifier'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/booking_management/get_booking_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/booking_management/get_booking_controller').default['handle']>>>
    }
  }
  'admin.bookings.assign_booking_driver': {
    methods: ["PATCH"]
    pattern: '/api/v1/admins/bookings/:identifier/assign-driver'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/admin/booking_management/assign_booking_driver_request_validator').default)>>
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/admin/booking_management/assign_booking_driver_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/booking_management/assign_booking_driver_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/booking_management/assign_booking_driver_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.bookings.cancel_booking': {
    methods: ["PATCH"]
    pattern: '/api/v1/admins/bookings/:identifier/cancel'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/booking_management/cancel_booking_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/booking_management/cancel_booking_controller').default['handle']>>>
    }
  }
  'admin.bookings.complete_booking': {
    methods: ["PATCH"]
    pattern: '/api/v1/admins/bookings/:identifier/complete'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/admin/booking_management/complete_booking_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/admin/booking_management/complete_booking_controller').default['handle']>>>
    }
  }
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
  'customer.bookings.create_booking': {
    methods: ["POST"]
    pattern: '/api/v1/customer/bookings'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/customer/booking/create_booking_request_validator').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/customer/booking/create_booking_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/booking/create_booking_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/booking/create_booking_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'customer.bookings.fetch_bookings': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/customer/bookings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/v1/customer/booking/fetch_bookings_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/booking/fetch_bookings_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/booking/fetch_bookings_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'customer.bookings.get_booking': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/customer/bookings/:bookingIdentifier'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { bookingIdentifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/booking/get_booking_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/booking/get_booking_controller').default['handle']>>>
    }
  }
  'customer.bookings.checkout_booking_with_card': {
    methods: ["POST"]
    pattern: '/api/v1/customer/bookings/:bookingIdentifier/checkout/card'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { bookingIdentifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/booking/checkout_booking_with_card_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/booking/checkout_booking_with_card_controller').default['handle']>>>
    }
  }
  'customer.notifications.fetch_notifications': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/customer/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/notifications/fetch_notifications_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/notifications/fetch_notifications_controller').default['handle']>>>
    }
  }
  'customer.notifications.mark_notification_as_read': {
    methods: ["PATCH"]
    pattern: '/api/v1/customer/notifications/:notificationIdentifier/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { notificationIdentifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/customer/notifications/mark_notification_as_read_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/customer/notifications/mark_notification_as_read_controller').default['handle']>>>
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
  'driver.notifications.fetch_notifications': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/driver/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/notifications/fetch_notifications_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/notifications/fetch_notifications_controller').default['handle']>>>
    }
  }
  'driver.notifications.mark_notification_as_read': {
    methods: ["PATCH"]
    pattern: '/api/v1/driver/notifications/:notificationIdentifier/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { notificationIdentifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/notifications/mark_notification_as_read_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/notifications/mark_notification_as_read_controller').default['handle']>>>
    }
  }
  'driver.bookings.fetch_bookings': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/driver/bookings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/v1/driver/booking_management/fetch_bookings_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/booking_management/fetch_bookings_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/booking_management/fetch_bookings_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.bookings.get_booking': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/driver/bookings/:identifier'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/booking_management/get_booking_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/booking_management/get_booking_controller').default['handle']>>>
    }
  }
  'driver.bookings.accept_booking': {
    methods: ["PATCH"]
    pattern: '/api/v1/driver/bookings/:identifier/accept'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/booking_management/accept_booking_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/booking_management/accept_booking_controller').default['handle']>>>
    }
  }
  'driver.bookings.reject_booking': {
    methods: ["PATCH"]
    pattern: '/api/v1/driver/bookings/:identifier/reject'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/booking_management/reject_booking_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/booking_management/reject_booking_controller').default['handle']>>>
    }
  }
  'driver.bookings.update_booking_trip_progress': {
    methods: ["PATCH"]
    pattern: '/api/v1/driver/bookings/:identifier/trip-progress'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/v1/driver/booking_management/update_booking_trip_progress_request_validator').default)>>
      paramsTuple: [ParamValue]
      params: { identifier: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/v1/driver/booking_management/update_booking_trip_progress_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/booking_management/update_booking_trip_progress_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/booking_management/update_booking_trip_progress_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.wallet.get_wallet': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/driver/wallet'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/wallet/get_wallet_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/wallet/get_wallet_controller').default['handle']>>>
    }
  }
  'driver.wallet.fetch_wallet_transactions': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/driver/wallet/transactions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/v1/driver/wallet/fetch_wallet_transactions_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/wallet/fetch_wallet_transactions_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/wallet/fetch_wallet_transactions_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'driver.wallet.get_wallet_transaction': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/driver/wallet/transactions/:transactionIdentifier'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { transactionIdentifier: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/driver/wallet/get_wallet_transaction_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/driver/wallet/get_wallet_transaction_controller').default['handle']>>>
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
  'common.finance.process_paystack_webhook': {
    methods: ["POST"]
    pattern: '/api/v1/common/finance/webhooks/paystack'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/common/finance/process_paystack_webhook_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/common/finance/process_paystack_webhook_controller').default['handle']>>>
    }
  }
  'common.vehicle.fetch_vehicle_models': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/common/vehicle/vehicle-models'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/v1/common/vehicle/fetch_vehicle_models_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/common/vehicle/fetch_vehicle_models_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/common/vehicle/fetch_vehicle_models_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/common/vehicle/fetch_vehicle_makes_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/common/vehicle/fetch_vehicle_makes_controller').default['handle']>>>
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
  'common.bookings.fetch_ride_types': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/common/bookings/ride-types'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/common/booking/fetch_ride_types_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/common/booking/fetch_ride_types_controller').default['handle']>>>
    }
  }
  'common.bookings.fetch_popular_locations': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/common/bookings/popular-locations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/v1/common/booking/fetch_popular_locations_request_validator').default)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/common/booking/fetch_popular_locations_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/common/booking/fetch_popular_locations_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
