/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'admin.authentication.authenticate_admin': {
    methods: ["POST"],
    pattern: '/api/v1/admins/authentication/authenticate',
    tokens: [{"old":"/api/v1/admins/authentication/authenticate","type":0,"val":"api","end":""},{"old":"/api/v1/admins/authentication/authenticate","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/authentication/authenticate","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/authentication/authenticate","type":0,"val":"authentication","end":""},{"old":"/api/v1/admins/authentication/authenticate","type":0,"val":"authenticate","end":""}],
    types: placeholder as Registry['admin.authentication.authenticate_admin']['types'],
  },
  'admin.customer_management.customers.fetch_customers': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admins/customer-management/customers',
    tokens: [{"old":"/api/v1/admins/customer-management/customers","type":0,"val":"api","end":""},{"old":"/api/v1/admins/customer-management/customers","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/customer-management/customers","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/customer-management/customers","type":0,"val":"customer-management","end":""},{"old":"/api/v1/admins/customer-management/customers","type":0,"val":"customers","end":""}],
    types: placeholder as Registry['admin.customer_management.customers.fetch_customers']['types'],
  },
  'admin.customer_management.customers.get_customer': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admins/customer-management/customers/:identifier',
    tokens: [{"old":"/api/v1/admins/customer-management/customers/:identifier","type":0,"val":"api","end":""},{"old":"/api/v1/admins/customer-management/customers/:identifier","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/customer-management/customers/:identifier","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/customer-management/customers/:identifier","type":0,"val":"customer-management","end":""},{"old":"/api/v1/admins/customer-management/customers/:identifier","type":0,"val":"customers","end":""},{"old":"/api/v1/admins/customer-management/customers/:identifier","type":1,"val":"identifier","end":""}],
    types: placeholder as Registry['admin.customer_management.customers.get_customer']['types'],
  },
  'admin.driver_management.fetch_drivers': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admins/driver-management/drivers',
    tokens: [{"old":"/api/v1/admins/driver-management/drivers","type":0,"val":"api","end":""},{"old":"/api/v1/admins/driver-management/drivers","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/driver-management/drivers","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/driver-management/drivers","type":0,"val":"driver-management","end":""},{"old":"/api/v1/admins/driver-management/drivers","type":0,"val":"drivers","end":""}],
    types: placeholder as Registry['admin.driver_management.fetch_drivers']['types'],
  },
  'admin.driver_management.get_driver': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admins/driver-management/drivers/:identifier',
    tokens: [{"old":"/api/v1/admins/driver-management/drivers/:identifier","type":0,"val":"api","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier","type":0,"val":"driver-management","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier","type":0,"val":"drivers","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier","type":1,"val":"identifier","end":""}],
    types: placeholder as Registry['admin.driver_management.get_driver']['types'],
  },
  'admin.driver_management.approve_driver': {
    methods: ["POST"],
    pattern: '/api/v1/admins/driver-management/drivers/:identifier/approve',
    tokens: [{"old":"/api/v1/admins/driver-management/drivers/:identifier/approve","type":0,"val":"api","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/approve","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/approve","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/approve","type":0,"val":"driver-management","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/approve","type":0,"val":"drivers","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/approve","type":1,"val":"identifier","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/approve","type":0,"val":"approve","end":""}],
    types: placeholder as Registry['admin.driver_management.approve_driver']['types'],
  },
  'admin.driver_management.reject_driver': {
    methods: ["POST"],
    pattern: '/api/v1/admins/driver-management/drivers/:identifier/reject',
    tokens: [{"old":"/api/v1/admins/driver-management/drivers/:identifier/reject","type":0,"val":"api","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/reject","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/reject","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/reject","type":0,"val":"driver-management","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/reject","type":0,"val":"drivers","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/reject","type":1,"val":"identifier","end":""},{"old":"/api/v1/admins/driver-management/drivers/:identifier/reject","type":0,"val":"reject","end":""}],
    types: placeholder as Registry['admin.driver_management.reject_driver']['types'],
  },
  'admin.settings.create_ride_type': {
    methods: ["POST"],
    pattern: '/api/v1/admins/settings/booking/ride-types',
    tokens: [{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"api","end":""},{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"settings","end":""},{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"booking","end":""},{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"ride-types","end":""}],
    types: placeholder as Registry['admin.settings.create_ride_type']['types'],
  },
  'admin.settings.update_ride_type': {
    methods: ["PATCH"],
    pattern: '/api/v1/admins/settings/booking/ride-types/:identifier',
    tokens: [{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"api","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"settings","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"booking","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"ride-types","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":1,"val":"identifier","end":""}],
    types: placeholder as Registry['admin.settings.update_ride_type']['types'],
  },
  'admin.settings.fetch_ride_types': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admins/settings/booking/ride-types',
    tokens: [{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"api","end":""},{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"settings","end":""},{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"booking","end":""},{"old":"/api/v1/admins/settings/booking/ride-types","type":0,"val":"ride-types","end":""}],
    types: placeholder as Registry['admin.settings.fetch_ride_types']['types'],
  },
  'admin.settings.get_ride_type': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admins/settings/booking/ride-types/:identifier',
    tokens: [{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"api","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"settings","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"booking","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":0,"val":"ride-types","end":""},{"old":"/api/v1/admins/settings/booking/ride-types/:identifier","type":1,"val":"identifier","end":""}],
    types: placeholder as Registry['admin.settings.get_ride_type']['types'],
  },
  'admin.settings.create_popular_location': {
    methods: ["POST"],
    pattern: '/api/v1/admins/settings/booking/popular-locations',
    tokens: [{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"api","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"settings","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"booking","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"popular-locations","end":""}],
    types: placeholder as Registry['admin.settings.create_popular_location']['types'],
  },
  'admin.settings.update_popular_location': {
    methods: ["PATCH"],
    pattern: '/api/v1/admins/settings/booking/popular-locations/:identifier',
    tokens: [{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"api","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"settings","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"booking","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"popular-locations","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":1,"val":"identifier","end":""}],
    types: placeholder as Registry['admin.settings.update_popular_location']['types'],
  },
  'admin.settings.fetch_popular_locations': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admins/settings/booking/popular-locations',
    tokens: [{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"api","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"settings","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"booking","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations","type":0,"val":"popular-locations","end":""}],
    types: placeholder as Registry['admin.settings.fetch_popular_locations']['types'],
  },
  'admin.settings.get_popular_location': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admins/settings/booking/popular-locations/:identifier',
    tokens: [{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"api","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"settings","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"booking","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":0,"val":"popular-locations","end":""},{"old":"/api/v1/admins/settings/booking/popular-locations/:identifier","type":1,"val":"identifier","end":""}],
    types: placeholder as Registry['admin.settings.get_popular_location']['types'],
  },
  'admin.bookings.fetch_bookings': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admins/bookings',
    tokens: [{"old":"/api/v1/admins/bookings","type":0,"val":"api","end":""},{"old":"/api/v1/admins/bookings","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/bookings","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/bookings","type":0,"val":"bookings","end":""}],
    types: placeholder as Registry['admin.bookings.fetch_bookings']['types'],
  },
  'admin.bookings.get_booking': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admins/bookings/:identifier',
    tokens: [{"old":"/api/v1/admins/bookings/:identifier","type":0,"val":"api","end":""},{"old":"/api/v1/admins/bookings/:identifier","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/bookings/:identifier","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/bookings/:identifier","type":0,"val":"bookings","end":""},{"old":"/api/v1/admins/bookings/:identifier","type":1,"val":"identifier","end":""}],
    types: placeholder as Registry['admin.bookings.get_booking']['types'],
  },
  'admin.bookings.assign_booking_driver': {
    methods: ["PATCH"],
    pattern: '/api/v1/admins/bookings/:identifier/assign-driver',
    tokens: [{"old":"/api/v1/admins/bookings/:identifier/assign-driver","type":0,"val":"api","end":""},{"old":"/api/v1/admins/bookings/:identifier/assign-driver","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/bookings/:identifier/assign-driver","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/bookings/:identifier/assign-driver","type":0,"val":"bookings","end":""},{"old":"/api/v1/admins/bookings/:identifier/assign-driver","type":1,"val":"identifier","end":""},{"old":"/api/v1/admins/bookings/:identifier/assign-driver","type":0,"val":"assign-driver","end":""}],
    types: placeholder as Registry['admin.bookings.assign_booking_driver']['types'],
  },
  'admin.bookings.cancel_booking': {
    methods: ["PATCH"],
    pattern: '/api/v1/admins/bookings/:identifier/cancel',
    tokens: [{"old":"/api/v1/admins/bookings/:identifier/cancel","type":0,"val":"api","end":""},{"old":"/api/v1/admins/bookings/:identifier/cancel","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/bookings/:identifier/cancel","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/bookings/:identifier/cancel","type":0,"val":"bookings","end":""},{"old":"/api/v1/admins/bookings/:identifier/cancel","type":1,"val":"identifier","end":""},{"old":"/api/v1/admins/bookings/:identifier/cancel","type":0,"val":"cancel","end":""}],
    types: placeholder as Registry['admin.bookings.cancel_booking']['types'],
  },
  'admin.bookings.complete_booking': {
    methods: ["PATCH"],
    pattern: '/api/v1/admins/bookings/:identifier/complete',
    tokens: [{"old":"/api/v1/admins/bookings/:identifier/complete","type":0,"val":"api","end":""},{"old":"/api/v1/admins/bookings/:identifier/complete","type":0,"val":"v1","end":""},{"old":"/api/v1/admins/bookings/:identifier/complete","type":0,"val":"admins","end":""},{"old":"/api/v1/admins/bookings/:identifier/complete","type":0,"val":"bookings","end":""},{"old":"/api/v1/admins/bookings/:identifier/complete","type":1,"val":"identifier","end":""},{"old":"/api/v1/admins/bookings/:identifier/complete","type":0,"val":"complete","end":""}],
    types: placeholder as Registry['admin.bookings.complete_booking']['types'],
  },
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
  'customer.bookings.create_booking': {
    methods: ["POST"],
    pattern: '/api/v1/customer/bookings',
    tokens: [{"old":"/api/v1/customer/bookings","type":0,"val":"api","end":""},{"old":"/api/v1/customer/bookings","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/bookings","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/bookings","type":0,"val":"bookings","end":""}],
    types: placeholder as Registry['customer.bookings.create_booking']['types'],
  },
  'customer.bookings.fetch_bookings': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/customer/bookings',
    tokens: [{"old":"/api/v1/customer/bookings","type":0,"val":"api","end":""},{"old":"/api/v1/customer/bookings","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/bookings","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/bookings","type":0,"val":"bookings","end":""}],
    types: placeholder as Registry['customer.bookings.fetch_bookings']['types'],
  },
  'customer.bookings.get_booking': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/customer/bookings/:bookingIdentifier',
    tokens: [{"old":"/api/v1/customer/bookings/:bookingIdentifier","type":0,"val":"api","end":""},{"old":"/api/v1/customer/bookings/:bookingIdentifier","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/bookings/:bookingIdentifier","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/bookings/:bookingIdentifier","type":0,"val":"bookings","end":""},{"old":"/api/v1/customer/bookings/:bookingIdentifier","type":1,"val":"bookingIdentifier","end":""}],
    types: placeholder as Registry['customer.bookings.get_booking']['types'],
  },
  'customer.bookings.checkout_booking_with_card': {
    methods: ["POST"],
    pattern: '/api/v1/customer/bookings/:bookingIdentifier/checkout/card',
    tokens: [{"old":"/api/v1/customer/bookings/:bookingIdentifier/checkout/card","type":0,"val":"api","end":""},{"old":"/api/v1/customer/bookings/:bookingIdentifier/checkout/card","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/bookings/:bookingIdentifier/checkout/card","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/bookings/:bookingIdentifier/checkout/card","type":0,"val":"bookings","end":""},{"old":"/api/v1/customer/bookings/:bookingIdentifier/checkout/card","type":1,"val":"bookingIdentifier","end":""},{"old":"/api/v1/customer/bookings/:bookingIdentifier/checkout/card","type":0,"val":"checkout","end":""},{"old":"/api/v1/customer/bookings/:bookingIdentifier/checkout/card","type":0,"val":"card","end":""}],
    types: placeholder as Registry['customer.bookings.checkout_booking_with_card']['types'],
  },
  'customer.notifications.fetch_notifications': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/customer/notifications',
    tokens: [{"old":"/api/v1/customer/notifications","type":0,"val":"api","end":""},{"old":"/api/v1/customer/notifications","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/notifications","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/notifications","type":0,"val":"notifications","end":""}],
    types: placeholder as Registry['customer.notifications.fetch_notifications']['types'],
  },
  'customer.notifications.mark_notification_as_read': {
    methods: ["PATCH"],
    pattern: '/api/v1/customer/notifications/:notificationIdentifier/read',
    tokens: [{"old":"/api/v1/customer/notifications/:notificationIdentifier/read","type":0,"val":"api","end":""},{"old":"/api/v1/customer/notifications/:notificationIdentifier/read","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/notifications/:notificationIdentifier/read","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/notifications/:notificationIdentifier/read","type":0,"val":"notifications","end":""},{"old":"/api/v1/customer/notifications/:notificationIdentifier/read","type":1,"val":"notificationIdentifier","end":""},{"old":"/api/v1/customer/notifications/:notificationIdentifier/read","type":0,"val":"read","end":""}],
    types: placeholder as Registry['customer.notifications.mark_notification_as_read']['types'],
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
  'driver.notifications.fetch_notifications': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/driver/notifications',
    tokens: [{"old":"/api/v1/driver/notifications","type":0,"val":"api","end":""},{"old":"/api/v1/driver/notifications","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/notifications","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/notifications","type":0,"val":"notifications","end":""}],
    types: placeholder as Registry['driver.notifications.fetch_notifications']['types'],
  },
  'driver.notifications.mark_notification_as_read': {
    methods: ["PATCH"],
    pattern: '/api/v1/driver/notifications/:notificationIdentifier/read',
    tokens: [{"old":"/api/v1/driver/notifications/:notificationIdentifier/read","type":0,"val":"api","end":""},{"old":"/api/v1/driver/notifications/:notificationIdentifier/read","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/notifications/:notificationIdentifier/read","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/notifications/:notificationIdentifier/read","type":0,"val":"notifications","end":""},{"old":"/api/v1/driver/notifications/:notificationIdentifier/read","type":1,"val":"notificationIdentifier","end":""},{"old":"/api/v1/driver/notifications/:notificationIdentifier/read","type":0,"val":"read","end":""}],
    types: placeholder as Registry['driver.notifications.mark_notification_as_read']['types'],
  },
  'driver.bookings.fetch_bookings': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/driver/bookings',
    tokens: [{"old":"/api/v1/driver/bookings","type":0,"val":"api","end":""},{"old":"/api/v1/driver/bookings","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/bookings","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/bookings","type":0,"val":"bookings","end":""}],
    types: placeholder as Registry['driver.bookings.fetch_bookings']['types'],
  },
  'driver.bookings.get_booking': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/driver/bookings/:identifier',
    tokens: [{"old":"/api/v1/driver/bookings/:identifier","type":0,"val":"api","end":""},{"old":"/api/v1/driver/bookings/:identifier","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/bookings/:identifier","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/bookings/:identifier","type":0,"val":"bookings","end":""},{"old":"/api/v1/driver/bookings/:identifier","type":1,"val":"identifier","end":""}],
    types: placeholder as Registry['driver.bookings.get_booking']['types'],
  },
  'driver.bookings.accept_booking': {
    methods: ["PATCH"],
    pattern: '/api/v1/driver/bookings/:identifier/accept',
    tokens: [{"old":"/api/v1/driver/bookings/:identifier/accept","type":0,"val":"api","end":""},{"old":"/api/v1/driver/bookings/:identifier/accept","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/bookings/:identifier/accept","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/bookings/:identifier/accept","type":0,"val":"bookings","end":""},{"old":"/api/v1/driver/bookings/:identifier/accept","type":1,"val":"identifier","end":""},{"old":"/api/v1/driver/bookings/:identifier/accept","type":0,"val":"accept","end":""}],
    types: placeholder as Registry['driver.bookings.accept_booking']['types'],
  },
  'driver.bookings.reject_booking': {
    methods: ["PATCH"],
    pattern: '/api/v1/driver/bookings/:identifier/reject',
    tokens: [{"old":"/api/v1/driver/bookings/:identifier/reject","type":0,"val":"api","end":""},{"old":"/api/v1/driver/bookings/:identifier/reject","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/bookings/:identifier/reject","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/bookings/:identifier/reject","type":0,"val":"bookings","end":""},{"old":"/api/v1/driver/bookings/:identifier/reject","type":1,"val":"identifier","end":""},{"old":"/api/v1/driver/bookings/:identifier/reject","type":0,"val":"reject","end":""}],
    types: placeholder as Registry['driver.bookings.reject_booking']['types'],
  },
  'driver.bookings.update_booking_trip_progress': {
    methods: ["PATCH"],
    pattern: '/api/v1/driver/bookings/:identifier/trip-progress',
    tokens: [{"old":"/api/v1/driver/bookings/:identifier/trip-progress","type":0,"val":"api","end":""},{"old":"/api/v1/driver/bookings/:identifier/trip-progress","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/bookings/:identifier/trip-progress","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/bookings/:identifier/trip-progress","type":0,"val":"bookings","end":""},{"old":"/api/v1/driver/bookings/:identifier/trip-progress","type":1,"val":"identifier","end":""},{"old":"/api/v1/driver/bookings/:identifier/trip-progress","type":0,"val":"trip-progress","end":""}],
    types: placeholder as Registry['driver.bookings.update_booking_trip_progress']['types'],
  },
  'driver.wallet.get_wallet': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/driver/wallet',
    tokens: [{"old":"/api/v1/driver/wallet","type":0,"val":"api","end":""},{"old":"/api/v1/driver/wallet","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/wallet","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/wallet","type":0,"val":"wallet","end":""}],
    types: placeholder as Registry['driver.wallet.get_wallet']['types'],
  },
  'driver.wallet.fetch_wallet_transactions': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/driver/wallet/transactions',
    tokens: [{"old":"/api/v1/driver/wallet/transactions","type":0,"val":"api","end":""},{"old":"/api/v1/driver/wallet/transactions","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/wallet/transactions","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/wallet/transactions","type":0,"val":"wallet","end":""},{"old":"/api/v1/driver/wallet/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['driver.wallet.fetch_wallet_transactions']['types'],
  },
  'driver.wallet.get_wallet_transaction': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/driver/wallet/transactions/:transactionIdentifier',
    tokens: [{"old":"/api/v1/driver/wallet/transactions/:transactionIdentifier","type":0,"val":"api","end":""},{"old":"/api/v1/driver/wallet/transactions/:transactionIdentifier","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/wallet/transactions/:transactionIdentifier","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/wallet/transactions/:transactionIdentifier","type":0,"val":"wallet","end":""},{"old":"/api/v1/driver/wallet/transactions/:transactionIdentifier","type":0,"val":"transactions","end":""},{"old":"/api/v1/driver/wallet/transactions/:transactionIdentifier","type":1,"val":"transactionIdentifier","end":""}],
    types: placeholder as Registry['driver.wallet.get_wallet_transaction']['types'],
  },
  'driver.wallet.initiate_wallet_withdrawal': {
    methods: ["POST"],
    pattern: '/api/v1/driver/wallet/withdraw',
    tokens: [{"old":"/api/v1/driver/wallet/withdraw","type":0,"val":"api","end":""},{"old":"/api/v1/driver/wallet/withdraw","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/wallet/withdraw","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/wallet/withdraw","type":0,"val":"wallet","end":""},{"old":"/api/v1/driver/wallet/withdraw","type":0,"val":"withdraw","end":""}],
    types: placeholder as Registry['driver.wallet.initiate_wallet_withdrawal']['types'],
  },
  'driver.dashboard.fetch_bookings_metrics': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/driver/dashboard/bookings-metrics',
    tokens: [{"old":"/api/v1/driver/dashboard/bookings-metrics","type":0,"val":"api","end":""},{"old":"/api/v1/driver/dashboard/bookings-metrics","type":0,"val":"v1","end":""},{"old":"/api/v1/driver/dashboard/bookings-metrics","type":0,"val":"driver","end":""},{"old":"/api/v1/driver/dashboard/bookings-metrics","type":0,"val":"dashboard","end":""},{"old":"/api/v1/driver/dashboard/bookings-metrics","type":0,"val":"bookings-metrics","end":""}],
    types: placeholder as Registry['driver.dashboard.fetch_bookings_metrics']['types'],
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
  'common.finance.process_paystack_webhook': {
    methods: ["POST"],
    pattern: '/api/v1/common/finance/webhooks/paystack',
    tokens: [{"old":"/api/v1/common/finance/webhooks/paystack","type":0,"val":"api","end":""},{"old":"/api/v1/common/finance/webhooks/paystack","type":0,"val":"v1","end":""},{"old":"/api/v1/common/finance/webhooks/paystack","type":0,"val":"common","end":""},{"old":"/api/v1/common/finance/webhooks/paystack","type":0,"val":"finance","end":""},{"old":"/api/v1/common/finance/webhooks/paystack","type":0,"val":"webhooks","end":""},{"old":"/api/v1/common/finance/webhooks/paystack","type":0,"val":"paystack","end":""}],
    types: placeholder as Registry['common.finance.process_paystack_webhook']['types'],
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
  'common.bookings.fetch_ride_types': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/common/bookings/ride-types',
    tokens: [{"old":"/api/v1/common/bookings/ride-types","type":0,"val":"api","end":""},{"old":"/api/v1/common/bookings/ride-types","type":0,"val":"v1","end":""},{"old":"/api/v1/common/bookings/ride-types","type":0,"val":"common","end":""},{"old":"/api/v1/common/bookings/ride-types","type":0,"val":"bookings","end":""},{"old":"/api/v1/common/bookings/ride-types","type":0,"val":"ride-types","end":""}],
    types: placeholder as Registry['common.bookings.fetch_ride_types']['types'],
  },
  'common.bookings.fetch_popular_locations': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/common/bookings/popular-locations',
    tokens: [{"old":"/api/v1/common/bookings/popular-locations","type":0,"val":"api","end":""},{"old":"/api/v1/common/bookings/popular-locations","type":0,"val":"v1","end":""},{"old":"/api/v1/common/bookings/popular-locations","type":0,"val":"common","end":""},{"old":"/api/v1/common/bookings/popular-locations","type":0,"val":"bookings","end":""},{"old":"/api/v1/common/bookings/popular-locations","type":0,"val":"popular-locations","end":""}],
    types: placeholder as Registry['common.bookings.fetch_popular_locations']['types'],
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
