/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'customer.authentication.onboarding': {
    methods: ["POST"],
    pattern: '/api/v1/customers/authentication/onboarding',
    tokens: [{"old":"/api/v1/customers/authentication/onboarding","type":0,"val":"api","end":""},{"old":"/api/v1/customers/authentication/onboarding","type":0,"val":"v1","end":""},{"old":"/api/v1/customers/authentication/onboarding","type":0,"val":"customers","end":""},{"old":"/api/v1/customers/authentication/onboarding","type":0,"val":"authentication","end":""},{"old":"/api/v1/customers/authentication/onboarding","type":0,"val":"onboarding","end":""}],
    types: placeholder as Registry['customer.authentication.onboarding']['types'],
  },
  'customer.authentication.authenticate_customer': {
    methods: ["POST"],
    pattern: '/api/v1/customers/authentication/authenticate',
    tokens: [{"old":"/api/v1/customers/authentication/authenticate","type":0,"val":"api","end":""},{"old":"/api/v1/customers/authentication/authenticate","type":0,"val":"v1","end":""},{"old":"/api/v1/customers/authentication/authenticate","type":0,"val":"customers","end":""},{"old":"/api/v1/customers/authentication/authenticate","type":0,"val":"authentication","end":""},{"old":"/api/v1/customers/authentication/authenticate","type":0,"val":"authenticate","end":""}],
    types: placeholder as Registry['customer.authentication.authenticate_customer']['types'],
  },
  'customer.account-activation.request_account_activation_token': {
    methods: ["POST"],
    pattern: '/api/v1/customers/account-activation/request-token',
    tokens: [{"old":"/api/v1/customers/account-activation/request-token","type":0,"val":"api","end":""},{"old":"/api/v1/customers/account-activation/request-token","type":0,"val":"v1","end":""},{"old":"/api/v1/customers/account-activation/request-token","type":0,"val":"customers","end":""},{"old":"/api/v1/customers/account-activation/request-token","type":0,"val":"account-activation","end":""},{"old":"/api/v1/customers/account-activation/request-token","type":0,"val":"request-token","end":""}],
    types: placeholder as Registry['customer.account-activation.request_account_activation_token']['types'],
  },
  'customer.account-activation.verify_account_activation_token': {
    methods: ["POST"],
    pattern: '/api/v1/customers/account-activation/verify-token',
    tokens: [{"old":"/api/v1/customers/account-activation/verify-token","type":0,"val":"api","end":""},{"old":"/api/v1/customers/account-activation/verify-token","type":0,"val":"v1","end":""},{"old":"/api/v1/customers/account-activation/verify-token","type":0,"val":"customers","end":""},{"old":"/api/v1/customers/account-activation/verify-token","type":0,"val":"account-activation","end":""},{"old":"/api/v1/customers/account-activation/verify-token","type":0,"val":"verify-token","end":""}],
    types: placeholder as Registry['customer.account-activation.verify_account_activation_token']['types'],
  },
  'customer.password-management.request_reset_password_otp_token': {
    methods: ["POST"],
    pattern: '/api/v1/customers/password-management/request-otp-token',
    tokens: [{"old":"/api/v1/customers/password-management/request-otp-token","type":0,"val":"api","end":""},{"old":"/api/v1/customers/password-management/request-otp-token","type":0,"val":"v1","end":""},{"old":"/api/v1/customers/password-management/request-otp-token","type":0,"val":"customers","end":""},{"old":"/api/v1/customers/password-management/request-otp-token","type":0,"val":"password-management","end":""},{"old":"/api/v1/customers/password-management/request-otp-token","type":0,"val":"request-otp-token","end":""}],
    types: placeholder as Registry['customer.password-management.request_reset_password_otp_token']['types'],
  },
  'customer.password-management.reset_password': {
    methods: ["POST"],
    pattern: '/api/v1/customers/password-management/reset',
    tokens: [{"old":"/api/v1/customers/password-management/reset","type":0,"val":"api","end":""},{"old":"/api/v1/customers/password-management/reset","type":0,"val":"v1","end":""},{"old":"/api/v1/customers/password-management/reset","type":0,"val":"customers","end":""},{"old":"/api/v1/customers/password-management/reset","type":0,"val":"password-management","end":""},{"old":"/api/v1/customers/password-management/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['customer.password-management.reset_password']['types'],
  },
  'driver.authentication.driver_onboarding': {
    methods: ["POST"],
    pattern: '/api/v1/drivers/authentication/onboarding',
    tokens: [{"old":"/api/v1/drivers/authentication/onboarding","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/authentication/onboarding","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/authentication/onboarding","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/authentication/onboarding","type":0,"val":"authentication","end":""},{"old":"/api/v1/drivers/authentication/onboarding","type":0,"val":"onboarding","end":""}],
    types: placeholder as Registry['driver.authentication.driver_onboarding']['types'],
  },
  'driver.authentication.authenticate_driver': {
    methods: ["POST"],
    pattern: '/api/v1/drivers/authentication/authenticate',
    tokens: [{"old":"/api/v1/drivers/authentication/authenticate","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/authentication/authenticate","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/authentication/authenticate","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/authentication/authenticate","type":0,"val":"authentication","end":""},{"old":"/api/v1/drivers/authentication/authenticate","type":0,"val":"authenticate","end":""}],
    types: placeholder as Registry['driver.authentication.authenticate_driver']['types'],
  },
  'driver.account-activation.driver_request_account_activation_token': {
    methods: ["POST"],
    pattern: '/api/v1/drivers/account-activation/request-token',
    tokens: [{"old":"/api/v1/drivers/account-activation/request-token","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/account-activation/request-token","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/account-activation/request-token","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/account-activation/request-token","type":0,"val":"account-activation","end":""},{"old":"/api/v1/drivers/account-activation/request-token","type":0,"val":"request-token","end":""}],
    types: placeholder as Registry['driver.account-activation.driver_request_account_activation_token']['types'],
  },
  'driver.account-activation.driver_verify_account_activation_token': {
    methods: ["POST"],
    pattern: '/api/v1/drivers/account-activation/verify-token',
    tokens: [{"old":"/api/v1/drivers/account-activation/verify-token","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/account-activation/verify-token","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/account-activation/verify-token","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/account-activation/verify-token","type":0,"val":"account-activation","end":""},{"old":"/api/v1/drivers/account-activation/verify-token","type":0,"val":"verify-token","end":""}],
    types: placeholder as Registry['driver.account-activation.driver_verify_account_activation_token']['types'],
  },
  'driver.password-management.driver_request_reset_password_otp_token': {
    methods: ["POST"],
    pattern: '/api/v1/drivers/password-management/request-otp-token',
    tokens: [{"old":"/api/v1/drivers/password-management/request-otp-token","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/password-management/request-otp-token","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/password-management/request-otp-token","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/password-management/request-otp-token","type":0,"val":"password-management","end":""},{"old":"/api/v1/drivers/password-management/request-otp-token","type":0,"val":"request-otp-token","end":""}],
    types: placeholder as Registry['driver.password-management.driver_request_reset_password_otp_token']['types'],
  },
  'driver.password-management.driver_reset_password': {
    methods: ["POST"],
    pattern: '/api/v1/drivers/password-management/reset',
    tokens: [{"old":"/api/v1/drivers/password-management/reset","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/password-management/reset","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/password-management/reset","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/password-management/reset","type":0,"val":"password-management","end":""},{"old":"/api/v1/drivers/password-management/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['driver.password-management.driver_reset_password']['types'],
  },
  'driver.profile.get_personal_information': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/drivers/profile/personal-information',
    tokens: [{"old":"/api/v1/drivers/profile/personal-information","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/profile/personal-information","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/profile/personal-information","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/profile/personal-information","type":0,"val":"profile","end":""},{"old":"/api/v1/drivers/profile/personal-information","type":0,"val":"personal-information","end":""}],
    types: placeholder as Registry['driver.profile.get_personal_information']['types'],
  },
  'driver.profile.update_personal_information': {
    methods: ["PATCH"],
    pattern: '/api/v1/drivers/profile/personal-information',
    tokens: [{"old":"/api/v1/drivers/profile/personal-information","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/profile/personal-information","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/profile/personal-information","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/profile/personal-information","type":0,"val":"profile","end":""},{"old":"/api/v1/drivers/profile/personal-information","type":0,"val":"personal-information","end":""}],
    types: placeholder as Registry['driver.profile.update_personal_information']['types'],
  },
  'driver.profile.get_vehicle_information': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/drivers/profile/vehicle-information',
    tokens: [{"old":"/api/v1/drivers/profile/vehicle-information","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/profile/vehicle-information","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/profile/vehicle-information","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/profile/vehicle-information","type":0,"val":"profile","end":""},{"old":"/api/v1/drivers/profile/vehicle-information","type":0,"val":"vehicle-information","end":""}],
    types: placeholder as Registry['driver.profile.get_vehicle_information']['types'],
  },
  'driver.profile.update_vehicle_information': {
    methods: ["PATCH"],
    pattern: '/api/v1/drivers/profile/vehicle-information',
    tokens: [{"old":"/api/v1/drivers/profile/vehicle-information","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/profile/vehicle-information","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/profile/vehicle-information","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/profile/vehicle-information","type":0,"val":"profile","end":""},{"old":"/api/v1/drivers/profile/vehicle-information","type":0,"val":"vehicle-information","end":""}],
    types: placeholder as Registry['driver.profile.update_vehicle_information']['types'],
  },
  'driver.profile.get_bank_account': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/drivers/profile/bank-account',
    tokens: [{"old":"/api/v1/drivers/profile/bank-account","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/profile/bank-account","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/profile/bank-account","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/profile/bank-account","type":0,"val":"profile","end":""},{"old":"/api/v1/drivers/profile/bank-account","type":0,"val":"bank-account","end":""}],
    types: placeholder as Registry['driver.profile.get_bank_account']['types'],
  },
  'driver.profile.update_bank_account': {
    methods: ["PATCH"],
    pattern: '/api/v1/drivers/profile/bank-account',
    tokens: [{"old":"/api/v1/drivers/profile/bank-account","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/profile/bank-account","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/profile/bank-account","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/profile/bank-account","type":0,"val":"profile","end":""},{"old":"/api/v1/drivers/profile/bank-account","type":0,"val":"bank-account","end":""}],
    types: placeholder as Registry['driver.profile.update_bank_account']['types'],
  },
  'driver.profile.get_documents': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/drivers/profile/documents',
    tokens: [{"old":"/api/v1/drivers/profile/documents","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/profile/documents","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/profile/documents","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/profile/documents","type":0,"val":"profile","end":""},{"old":"/api/v1/drivers/profile/documents","type":0,"val":"documents","end":""}],
    types: placeholder as Registry['driver.profile.get_documents']['types'],
  },
  'driver.profile.update_documents': {
    methods: ["PATCH"],
    pattern: '/api/v1/drivers/profile/documents',
    tokens: [{"old":"/api/v1/drivers/profile/documents","type":0,"val":"api","end":""},{"old":"/api/v1/drivers/profile/documents","type":0,"val":"v1","end":""},{"old":"/api/v1/drivers/profile/documents","type":0,"val":"drivers","end":""},{"old":"/api/v1/drivers/profile/documents","type":0,"val":"profile","end":""},{"old":"/api/v1/drivers/profile/documents","type":0,"val":"documents","end":""}],
    types: placeholder as Registry['driver.profile.update_documents']['types'],
  },
  'common.location.fetch_cities': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/common/location/cities',
    tokens: [{"old":"/api/v1/common/location/cities","type":0,"val":"api","end":""},{"old":"/api/v1/common/location/cities","type":0,"val":"v1","end":""},{"old":"/api/v1/common/location/cities","type":0,"val":"common","end":""},{"old":"/api/v1/common/location/cities","type":0,"val":"location","end":""},{"old":"/api/v1/common/location/cities","type":0,"val":"cities","end":""}],
    types: placeholder as Registry['common.location.fetch_cities']['types'],
  },
  'common.finance.fetch_banks': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/common/finance/banks',
    tokens: [{"old":"/api/v1/common/finance/banks","type":0,"val":"api","end":""},{"old":"/api/v1/common/finance/banks","type":0,"val":"v1","end":""},{"old":"/api/v1/common/finance/banks","type":0,"val":"common","end":""},{"old":"/api/v1/common/finance/banks","type":0,"val":"finance","end":""},{"old":"/api/v1/common/finance/banks","type":0,"val":"banks","end":""}],
    types: placeholder as Registry['common.finance.fetch_banks']['types'],
  },
  'common.vehicle.fetch_vehicle_models': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/common/vehicle/vehicle-models',
    tokens: [{"old":"/api/v1/common/vehicle/vehicle-models","type":0,"val":"api","end":""},{"old":"/api/v1/common/vehicle/vehicle-models","type":0,"val":"v1","end":""},{"old":"/api/v1/common/vehicle/vehicle-models","type":0,"val":"common","end":""},{"old":"/api/v1/common/vehicle/vehicle-models","type":0,"val":"vehicle","end":""},{"old":"/api/v1/common/vehicle/vehicle-models","type":0,"val":"vehicle-models","end":""}],
    types: placeholder as Registry['common.vehicle.fetch_vehicle_models']['types'],
  },
  'common.vehicle.fetch_vehicle_makes_controllers': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/common/vehicle/vehicle-makes',
    tokens: [{"old":"/api/v1/common/vehicle/vehicle-makes","type":0,"val":"api","end":""},{"old":"/api/v1/common/vehicle/vehicle-makes","type":0,"val":"v1","end":""},{"old":"/api/v1/common/vehicle/vehicle-makes","type":0,"val":"common","end":""},{"old":"/api/v1/common/vehicle/vehicle-makes","type":0,"val":"vehicle","end":""},{"old":"/api/v1/common/vehicle/vehicle-makes","type":0,"val":"vehicle-makes","end":""}],
    types: placeholder as Registry['common.vehicle.fetch_vehicle_makes_controllers']['types'],
  },
  'common.media.upload_image': {
    methods: ["POST"],
    pattern: '/api/v1/common/media/image',
    tokens: [{"old":"/api/v1/common/media/image","type":0,"val":"api","end":""},{"old":"/api/v1/common/media/image","type":0,"val":"v1","end":""},{"old":"/api/v1/common/media/image","type":0,"val":"common","end":""},{"old":"/api/v1/common/media/image","type":0,"val":"media","end":""},{"old":"/api/v1/common/media/image","type":0,"val":"image","end":""}],
    types: placeholder as Registry['common.media.upload_image']['types'],
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
