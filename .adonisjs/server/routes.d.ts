import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'admin.authentication.authenticate_admin': { paramsTuple?: []; params?: {} }
    'admin.customer_management.customers.fetch_customers': { paramsTuple?: []; params?: {} }
    'admin.customer_management.customers.get_customer': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.drivers.fetch_drivers': { paramsTuple?: []; params?: {} }
    'admin.driver_management.drivers.get_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.drivers.approve_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.drivers.reject_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.create_ride_type': { paramsTuple?: []; params?: {} }
    'admin.settings.update_ride_type': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'admin.settings.get_ride_type': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.create_popular_location': { paramsTuple?: []; params?: {} }
    'admin.settings.update_popular_location': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
    'admin.settings.get_popular_location': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'admin.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'customer.authentication.onboarding': { paramsTuple?: []; params?: {} }
    'customer.authentication.authenticate_customer': { paramsTuple?: []; params?: {} }
    'customer.account-activation.request_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.account-activation.verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.reset_password': { paramsTuple?: []; params?: {} }
    'create_booking': { paramsTuple?: []; params?: {} }
    'fetch_bookings': { paramsTuple?: []; params?: {} }
    'get_booking': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'checkout_booking_with_card': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'fetch_notifications': { paramsTuple?: []; params?: {} }
    'mark_notification_as_read': { paramsTuple: [ParamValue]; params: {'notificationIdentifier': ParamValue} }
    'driver.authentication.driver_onboarding': { paramsTuple?: []; params?: {} }
    'driver.authentication.authenticate_driver': { paramsTuple?: []; params?: {} }
    'driver.account-activation.driver_request_account_activation_token': { paramsTuple?: []; params?: {} }
    'driver.account-activation.driver_verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'driver.password-management.driver_request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'driver.password-management.driver_reset_password': { paramsTuple?: []; params?: {} }
    'driver.profile.get_personal_information': { paramsTuple?: []; params?: {} }
    'driver.profile.update_personal_information': { paramsTuple?: []; params?: {} }
    'driver.profile.get_vehicle_information': { paramsTuple?: []; params?: {} }
    'driver.profile.update_vehicle_information': { paramsTuple?: []; params?: {} }
    'driver.profile.get_bank_account': { paramsTuple?: []; params?: {} }
    'driver.profile.update_bank_account': { paramsTuple?: []; params?: {} }
    'driver.profile.get_documents': { paramsTuple?: []; params?: {} }
    'driver.profile.update_documents': { paramsTuple?: []; params?: {} }
    'common.location.fetch_cities': { paramsTuple?: []; params?: {} }
    'common.finance.fetch_banks': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_models': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_makes_controllers': { paramsTuple?: []; params?: {} }
    'common.media.upload_image': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'admin.authentication.authenticate_admin': { paramsTuple?: []; params?: {} }
    'admin.driver_management.drivers.approve_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.drivers.reject_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.create_ride_type': { paramsTuple?: []; params?: {} }
    'admin.settings.create_popular_location': { paramsTuple?: []; params?: {} }
    'customer.authentication.onboarding': { paramsTuple?: []; params?: {} }
    'customer.authentication.authenticate_customer': { paramsTuple?: []; params?: {} }
    'customer.account-activation.request_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.account-activation.verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.reset_password': { paramsTuple?: []; params?: {} }
    'create_booking': { paramsTuple?: []; params?: {} }
    'checkout_booking_with_card': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'driver.authentication.driver_onboarding': { paramsTuple?: []; params?: {} }
    'driver.authentication.authenticate_driver': { paramsTuple?: []; params?: {} }
    'driver.account-activation.driver_request_account_activation_token': { paramsTuple?: []; params?: {} }
    'driver.account-activation.driver_verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'driver.password-management.driver_request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'driver.password-management.driver_reset_password': { paramsTuple?: []; params?: {} }
    'common.media.upload_image': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'admin.customer_management.customers.fetch_customers': { paramsTuple?: []; params?: {} }
    'admin.customer_management.customers.get_customer': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.drivers.fetch_drivers': { paramsTuple?: []; params?: {} }
    'admin.driver_management.drivers.get_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'admin.settings.get_ride_type': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
    'admin.settings.get_popular_location': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'admin.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'fetch_bookings': { paramsTuple?: []; params?: {} }
    'get_booking': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'fetch_notifications': { paramsTuple?: []; params?: {} }
    'driver.profile.get_personal_information': { paramsTuple?: []; params?: {} }
    'driver.profile.get_vehicle_information': { paramsTuple?: []; params?: {} }
    'driver.profile.get_bank_account': { paramsTuple?: []; params?: {} }
    'driver.profile.get_documents': { paramsTuple?: []; params?: {} }
    'common.location.fetch_cities': { paramsTuple?: []; params?: {} }
    'common.finance.fetch_banks': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_models': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_makes_controllers': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'admin.customer_management.customers.fetch_customers': { paramsTuple?: []; params?: {} }
    'admin.customer_management.customers.get_customer': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.drivers.fetch_drivers': { paramsTuple?: []; params?: {} }
    'admin.driver_management.drivers.get_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'admin.settings.get_ride_type': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
    'admin.settings.get_popular_location': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'admin.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'fetch_bookings': { paramsTuple?: []; params?: {} }
    'get_booking': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'fetch_notifications': { paramsTuple?: []; params?: {} }
    'driver.profile.get_personal_information': { paramsTuple?: []; params?: {} }
    'driver.profile.get_vehicle_information': { paramsTuple?: []; params?: {} }
    'driver.profile.get_bank_account': { paramsTuple?: []; params?: {} }
    'driver.profile.get_documents': { paramsTuple?: []; params?: {} }
    'common.location.fetch_cities': { paramsTuple?: []; params?: {} }
    'common.finance.fetch_banks': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_models': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_makes_controllers': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'admin.settings.update_ride_type': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.update_popular_location': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'mark_notification_as_read': { paramsTuple: [ParamValue]; params: {'notificationIdentifier': ParamValue} }
    'driver.profile.update_personal_information': { paramsTuple?: []; params?: {} }
    'driver.profile.update_vehicle_information': { paramsTuple?: []; params?: {} }
    'driver.profile.update_bank_account': { paramsTuple?: []; params?: {} }
    'driver.profile.update_documents': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}