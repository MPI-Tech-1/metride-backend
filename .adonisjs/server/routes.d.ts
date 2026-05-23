import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'admin.authentication.authenticate_admin': { paramsTuple?: []; params?: {} }
    'admin.customer_management.customers.fetch_customers': { paramsTuple?: []; params?: {} }
    'admin.customer_management.customers.get_customer': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.fetch_drivers': { paramsTuple?: []; params?: {} }
    'admin.driver_management.fetch_active_drivers': { paramsTuple?: []; params?: {} }
    'admin.driver_management.get_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.approve_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.reject_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.update_driver_commission': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.upload_driver_reference_form': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.create_ride_type': { paramsTuple?: []; params?: {} }
    'admin.settings.update_ride_type': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'admin.settings.get_ride_type': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.create_popular_location': { paramsTuple?: []; params?: {} }
    'admin.settings.update_popular_location': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
    'admin.settings.get_popular_location': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.create_city': { paramsTuple?: []; params?: {} }
    'admin.settings.update_city': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_cities': { paramsTuple?: []; params?: {} }
    'admin.settings.get_city': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.create_vehicle_make': { paramsTuple?: []; params?: {} }
    'admin.settings.update_vehicle_make': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_vehicle_makes': { paramsTuple?: []; params?: {} }
    'admin.settings.get_vehicle_make': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.create_vehicle_model': { paramsTuple?: []; params?: {} }
    'admin.settings.update_vehicle_model': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_vehicle_models': { paramsTuple?: []; params?: {} }
    'admin.settings.get_vehicle_model': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'admin.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.assign_booking_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.cancel_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.complete_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.wallet_management.fetch_wallet_transactions': { paramsTuple?: []; params?: {} }
    'admin.wallet_management.get_wallet_transaction': { paramsTuple: [ParamValue]; params: {'transactionIdentifier': ParamValue} }
    'admin.wallet_management.fetch_wallet_withdrawal_requests': { paramsTuple?: []; params?: {} }
    'admin.wallet_management.approve_wallet_payout': { paramsTuple: [ParamValue]; params: {'withdrawalRequestIdentifier': ParamValue} }
    'admin.wallet_management.reject_wallet_payout': { paramsTuple: [ParamValue]; params: {'withdrawalRequestIdentifier': ParamValue} }
    'admin.dashboard.fetch_dashboard_overview': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_customer_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_driver_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_booking_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_payout_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_wallet_transaction_metrics': { paramsTuple?: []; params?: {} }
    'admin.vehicle_management.add_vehicle_photo': { paramsTuple?: []; params?: {} }
    'admin.vehicle_management.fetch_vehicle_photos': { paramsTuple?: []; params?: {} }
    'admin.vehicle_management.delete_vehicle_photo': { paramsTuple: [ParamValue]; params: {'photoIdentifier': ParamValue} }
    'customer.authentication.onboarding': { paramsTuple?: []; params?: {} }
    'customer.authentication.authenticate_customer': { paramsTuple?: []; params?: {} }
    'customer.account-activation.request_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.account-activation.verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.reset_password': { paramsTuple?: []; params?: {} }
    'customer.bookings.checkout_booking_with_card': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'customer.bookings.submit_booking_review': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'customer.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'customer.bookings.fetch_nearest_drivers': { paramsTuple?: []; params?: {} }
    'customer.bookings.create_shuttle_booking': { paramsTuple?: []; params?: {} }
    'customer.bookings.create_instant_booking': { paramsTuple?: []; params?: {} }
    'customer.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'customer.profile.fetch_ride_statistics': { paramsTuple?: []; params?: {} }
    'customer.profile.get_profile': { paramsTuple?: []; params?: {} }
    'customer.profile.update_profile': { paramsTuple?: []; params?: {} }
    'customer.notifications.fetch_notifications': { paramsTuple?: []; params?: {} }
    'customer.notifications.mark_notification_as_read': { paramsTuple: [ParamValue]; params: {'notificationIdentifier': ParamValue} }
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
    'driver.profile.get_profile': { paramsTuple?: []; params?: {} }
    'driver.notifications.fetch_notifications': { paramsTuple?: []; params?: {} }
    'driver.notifications.mark_notification_as_read': { paramsTuple: [ParamValue]; params: {'notificationIdentifier': ParamValue} }
    'driver.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'driver.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'driver.bookings.accept_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'driver.bookings.reject_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'driver.bookings.update_booking_trip_progress': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'driver.bookings.enable_ride_acceptance_status': { paramsTuple?: []; params?: {} }
    'driver.bookings.disable_ride_acceptance_status': { paramsTuple?: []; params?: {} }
    'driver.bookings.update_driver_location': { paramsTuple?: []; params?: {} }
    'driver.wallet.get_wallet': { paramsTuple?: []; params?: {} }
    'driver.wallet.fetch_wallet_transactions': { paramsTuple?: []; params?: {} }
    'driver.wallet.get_wallet_transaction': { paramsTuple: [ParamValue]; params: {'transactionIdentifier': ParamValue} }
    'driver.wallet.initiate_wallet_withdrawal': { paramsTuple?: []; params?: {} }
    'driver.dashboard.fetch_bookings_metrics': { paramsTuple?: []; params?: {} }
    'common.location.fetch_cities': { paramsTuple?: []; params?: {} }
    'common.finance.fetch_banks': { paramsTuple?: []; params?: {} }
    'common.finance.resolve_account': { paramsTuple?: []; params?: {} }
    'common.finance.process_approve_paystack_transaction': { paramsTuple?: []; params?: {} }
    'common.finance.process_paystack_webhook': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_models': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_makes_controllers': { paramsTuple?: []; params?: {} }
    'common.media.upload_image': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'admin.authentication.authenticate_admin': { paramsTuple?: []; params?: {} }
    'admin.driver_management.approve_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.reject_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.create_ride_type': { paramsTuple?: []; params?: {} }
    'admin.settings.create_popular_location': { paramsTuple?: []; params?: {} }
    'admin.settings.create_city': { paramsTuple?: []; params?: {} }
    'admin.settings.create_vehicle_make': { paramsTuple?: []; params?: {} }
    'admin.settings.create_vehicle_model': { paramsTuple?: []; params?: {} }
    'admin.wallet_management.approve_wallet_payout': { paramsTuple: [ParamValue]; params: {'withdrawalRequestIdentifier': ParamValue} }
    'admin.wallet_management.reject_wallet_payout': { paramsTuple: [ParamValue]; params: {'withdrawalRequestIdentifier': ParamValue} }
    'admin.vehicle_management.add_vehicle_photo': { paramsTuple?: []; params?: {} }
    'customer.authentication.onboarding': { paramsTuple?: []; params?: {} }
    'customer.authentication.authenticate_customer': { paramsTuple?: []; params?: {} }
    'customer.account-activation.request_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.account-activation.verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'customer.password-management.reset_password': { paramsTuple?: []; params?: {} }
    'customer.bookings.checkout_booking_with_card': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'customer.bookings.submit_booking_review': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'customer.bookings.fetch_nearest_drivers': { paramsTuple?: []; params?: {} }
    'customer.bookings.create_shuttle_booking': { paramsTuple?: []; params?: {} }
    'customer.bookings.create_instant_booking': { paramsTuple?: []; params?: {} }
    'driver.authentication.driver_onboarding': { paramsTuple?: []; params?: {} }
    'driver.authentication.authenticate_driver': { paramsTuple?: []; params?: {} }
    'driver.account-activation.driver_request_account_activation_token': { paramsTuple?: []; params?: {} }
    'driver.account-activation.driver_verify_account_activation_token': { paramsTuple?: []; params?: {} }
    'driver.password-management.driver_request_reset_password_otp_token': { paramsTuple?: []; params?: {} }
    'driver.password-management.driver_reset_password': { paramsTuple?: []; params?: {} }
    'driver.bookings.update_driver_location': { paramsTuple?: []; params?: {} }
    'driver.wallet.initiate_wallet_withdrawal': { paramsTuple?: []; params?: {} }
    'common.finance.process_approve_paystack_transaction': { paramsTuple?: []; params?: {} }
    'common.finance.process_paystack_webhook': { paramsTuple?: []; params?: {} }
    'common.media.upload_image': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'admin.customer_management.customers.fetch_customers': { paramsTuple?: []; params?: {} }
    'admin.customer_management.customers.get_customer': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.fetch_drivers': { paramsTuple?: []; params?: {} }
    'admin.driver_management.fetch_active_drivers': { paramsTuple?: []; params?: {} }
    'admin.driver_management.get_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'admin.settings.get_ride_type': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
    'admin.settings.get_popular_location': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_cities': { paramsTuple?: []; params?: {} }
    'admin.settings.get_city': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_vehicle_makes': { paramsTuple?: []; params?: {} }
    'admin.settings.get_vehicle_make': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_vehicle_models': { paramsTuple?: []; params?: {} }
    'admin.settings.get_vehicle_model': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'admin.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.wallet_management.fetch_wallet_transactions': { paramsTuple?: []; params?: {} }
    'admin.wallet_management.get_wallet_transaction': { paramsTuple: [ParamValue]; params: {'transactionIdentifier': ParamValue} }
    'admin.wallet_management.fetch_wallet_withdrawal_requests': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_dashboard_overview': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_customer_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_driver_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_booking_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_payout_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_wallet_transaction_metrics': { paramsTuple?: []; params?: {} }
    'admin.vehicle_management.fetch_vehicle_photos': { paramsTuple?: []; params?: {} }
    'customer.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'customer.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'customer.profile.fetch_ride_statistics': { paramsTuple?: []; params?: {} }
    'customer.profile.get_profile': { paramsTuple?: []; params?: {} }
    'customer.notifications.fetch_notifications': { paramsTuple?: []; params?: {} }
    'driver.profile.get_personal_information': { paramsTuple?: []; params?: {} }
    'driver.profile.get_vehicle_information': { paramsTuple?: []; params?: {} }
    'driver.profile.get_bank_account': { paramsTuple?: []; params?: {} }
    'driver.profile.get_documents': { paramsTuple?: []; params?: {} }
    'driver.profile.get_profile': { paramsTuple?: []; params?: {} }
    'driver.notifications.fetch_notifications': { paramsTuple?: []; params?: {} }
    'driver.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'driver.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'driver.wallet.get_wallet': { paramsTuple?: []; params?: {} }
    'driver.wallet.fetch_wallet_transactions': { paramsTuple?: []; params?: {} }
    'driver.wallet.get_wallet_transaction': { paramsTuple: [ParamValue]; params: {'transactionIdentifier': ParamValue} }
    'driver.dashboard.fetch_bookings_metrics': { paramsTuple?: []; params?: {} }
    'common.location.fetch_cities': { paramsTuple?: []; params?: {} }
    'common.finance.fetch_banks': { paramsTuple?: []; params?: {} }
    'common.finance.resolve_account': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_models': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_makes_controllers': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'admin.customer_management.customers.fetch_customers': { paramsTuple?: []; params?: {} }
    'admin.customer_management.customers.get_customer': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.fetch_drivers': { paramsTuple?: []; params?: {} }
    'admin.driver_management.fetch_active_drivers': { paramsTuple?: []; params?: {} }
    'admin.driver_management.get_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'admin.settings.get_ride_type': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
    'admin.settings.get_popular_location': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_cities': { paramsTuple?: []; params?: {} }
    'admin.settings.get_city': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_vehicle_makes': { paramsTuple?: []; params?: {} }
    'admin.settings.get_vehicle_make': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.fetch_vehicle_models': { paramsTuple?: []; params?: {} }
    'admin.settings.get_vehicle_model': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'admin.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.wallet_management.fetch_wallet_transactions': { paramsTuple?: []; params?: {} }
    'admin.wallet_management.get_wallet_transaction': { paramsTuple: [ParamValue]; params: {'transactionIdentifier': ParamValue} }
    'admin.wallet_management.fetch_wallet_withdrawal_requests': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_dashboard_overview': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_customer_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_driver_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_booking_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_payout_metrics': { paramsTuple?: []; params?: {} }
    'admin.dashboard.fetch_wallet_transaction_metrics': { paramsTuple?: []; params?: {} }
    'admin.vehicle_management.fetch_vehicle_photos': { paramsTuple?: []; params?: {} }
    'customer.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'bookingIdentifier': ParamValue} }
    'customer.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'customer.profile.fetch_ride_statistics': { paramsTuple?: []; params?: {} }
    'customer.profile.get_profile': { paramsTuple?: []; params?: {} }
    'customer.notifications.fetch_notifications': { paramsTuple?: []; params?: {} }
    'driver.profile.get_personal_information': { paramsTuple?: []; params?: {} }
    'driver.profile.get_vehicle_information': { paramsTuple?: []; params?: {} }
    'driver.profile.get_bank_account': { paramsTuple?: []; params?: {} }
    'driver.profile.get_documents': { paramsTuple?: []; params?: {} }
    'driver.profile.get_profile': { paramsTuple?: []; params?: {} }
    'driver.notifications.fetch_notifications': { paramsTuple?: []; params?: {} }
    'driver.bookings.fetch_bookings': { paramsTuple?: []; params?: {} }
    'driver.bookings.get_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'driver.wallet.get_wallet': { paramsTuple?: []; params?: {} }
    'driver.wallet.fetch_wallet_transactions': { paramsTuple?: []; params?: {} }
    'driver.wallet.get_wallet_transaction': { paramsTuple: [ParamValue]; params: {'transactionIdentifier': ParamValue} }
    'driver.dashboard.fetch_bookings_metrics': { paramsTuple?: []; params?: {} }
    'common.location.fetch_cities': { paramsTuple?: []; params?: {} }
    'common.finance.fetch_banks': { paramsTuple?: []; params?: {} }
    'common.finance.resolve_account': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_models': { paramsTuple?: []; params?: {} }
    'common.vehicle.fetch_vehicle_makes_controllers': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_ride_types': { paramsTuple?: []; params?: {} }
    'common.bookings.fetch_popular_locations': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'admin.driver_management.update_driver_commission': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.driver_management.upload_driver_reference_form': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.update_ride_type': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.update_popular_location': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.update_city': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.update_vehicle_make': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.settings.update_vehicle_model': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.assign_booking_driver': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.cancel_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'admin.bookings.complete_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'customer.profile.update_profile': { paramsTuple?: []; params?: {} }
    'customer.notifications.mark_notification_as_read': { paramsTuple: [ParamValue]; params: {'notificationIdentifier': ParamValue} }
    'driver.profile.update_personal_information': { paramsTuple?: []; params?: {} }
    'driver.profile.update_vehicle_information': { paramsTuple?: []; params?: {} }
    'driver.profile.update_bank_account': { paramsTuple?: []; params?: {} }
    'driver.profile.update_documents': { paramsTuple?: []; params?: {} }
    'driver.notifications.mark_notification_as_read': { paramsTuple: [ParamValue]; params: {'notificationIdentifier': ParamValue} }
    'driver.bookings.accept_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'driver.bookings.reject_booking': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'driver.bookings.update_booking_trip_progress': { paramsTuple: [ParamValue]; params: {'identifier': ParamValue} }
    'driver.bookings.enable_ride_acceptance_status': { paramsTuple?: []; params?: {} }
    'driver.bookings.disable_ride_acceptance_status': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'admin.vehicle_management.delete_vehicle_photo': { paramsTuple: [ParamValue]; params: {'photoIdentifier': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}