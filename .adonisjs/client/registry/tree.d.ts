/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  admin: {
    authentication: {
      authenticateAdmin: typeof routes['admin.authentication.authenticate_admin']
    }
    customerManagement: {
      customers: {
        fetchCustomers: typeof routes['admin.customer_management.customers.fetch_customers']
        getCustomer: typeof routes['admin.customer_management.customers.get_customer']
      }
    }
    driverManagement: {
      fetchDrivers: typeof routes['admin.driver_management.fetch_drivers']
      getDriver: typeof routes['admin.driver_management.get_driver']
      approveDriver: typeof routes['admin.driver_management.approve_driver']
      rejectDriver: typeof routes['admin.driver_management.reject_driver']
    }
    settings: {
      createRideType: typeof routes['admin.settings.create_ride_type']
      updateRideType: typeof routes['admin.settings.update_ride_type']
      fetchRideTypes: typeof routes['admin.settings.fetch_ride_types']
      getRideType: typeof routes['admin.settings.get_ride_type']
      createPopularLocation: typeof routes['admin.settings.create_popular_location']
      updatePopularLocation: typeof routes['admin.settings.update_popular_location']
      fetchPopularLocations: typeof routes['admin.settings.fetch_popular_locations']
      getPopularLocation: typeof routes['admin.settings.get_popular_location']
    }
    bookings: {
      fetchBookings: typeof routes['admin.bookings.fetch_bookings']
      getBooking: typeof routes['admin.bookings.get_booking']
      assignBookingDriver: typeof routes['admin.bookings.assign_booking_driver']
      cancelBooking: typeof routes['admin.bookings.cancel_booking']
      completeBooking: typeof routes['admin.bookings.complete_booking']
    }
  }
  customer: {
    authentication: {
      onboarding: typeof routes['customer.authentication.onboarding']
      authenticateCustomer: typeof routes['customer.authentication.authenticate_customer']
    }
    accountActivation: {
      requestAccountActivationToken: typeof routes['customer.account-activation.request_account_activation_token']
      verifyAccountActivationToken: typeof routes['customer.account-activation.verify_account_activation_token']
    }
    passwordManagement: {
      requestResetPasswordOtpToken: typeof routes['customer.password-management.request_reset_password_otp_token']
      resetPassword: typeof routes['customer.password-management.reset_password']
    }
    bookings: {
      createBooking: typeof routes['customer.bookings.create_booking']
      fetchBookings: typeof routes['customer.bookings.fetch_bookings']
      getBooking: typeof routes['customer.bookings.get_booking']
      checkoutBookingWithCard: typeof routes['customer.bookings.checkout_booking_with_card']
    }
    notifications: {
      fetchNotifications: typeof routes['customer.notifications.fetch_notifications']
      markNotificationAsRead: typeof routes['customer.notifications.mark_notification_as_read']
    }
  }
  driver: {
    authentication: {
      driverOnboarding: typeof routes['driver.authentication.driver_onboarding']
      authenticateDriver: typeof routes['driver.authentication.authenticate_driver']
    }
    accountActivation: {
      driverRequestAccountActivationToken: typeof routes['driver.account-activation.driver_request_account_activation_token']
      driverVerifyAccountActivationToken: typeof routes['driver.account-activation.driver_verify_account_activation_token']
    }
    passwordManagement: {
      driverRequestResetPasswordOtpToken: typeof routes['driver.password-management.driver_request_reset_password_otp_token']
      driverResetPassword: typeof routes['driver.password-management.driver_reset_password']
    }
    profile: {
      getPersonalInformation: typeof routes['driver.profile.get_personal_information']
      updatePersonalInformation: typeof routes['driver.profile.update_personal_information']
      getVehicleInformation: typeof routes['driver.profile.get_vehicle_information']
      updateVehicleInformation: typeof routes['driver.profile.update_vehicle_information']
      getBankAccount: typeof routes['driver.profile.get_bank_account']
      updateBankAccount: typeof routes['driver.profile.update_bank_account']
      getDocuments: typeof routes['driver.profile.get_documents']
      updateDocuments: typeof routes['driver.profile.update_documents']
    }
    notifications: {
      fetchNotifications: typeof routes['driver.notifications.fetch_notifications']
      markNotificationAsRead: typeof routes['driver.notifications.mark_notification_as_read']
    }
    bookings: {
      fetchBookings: typeof routes['driver.bookings.fetch_bookings']
      getBooking: typeof routes['driver.bookings.get_booking']
      acceptBooking: typeof routes['driver.bookings.accept_booking']
      rejectBooking: typeof routes['driver.bookings.reject_booking']
      updateBookingTripProgress: typeof routes['driver.bookings.update_booking_trip_progress']
    }
    wallet: {
      getWallet: typeof routes['driver.wallet.get_wallet']
      fetchWalletTransactions: typeof routes['driver.wallet.fetch_wallet_transactions']
      getWalletTransaction: typeof routes['driver.wallet.get_wallet_transaction']
      initiateWalletWithdrawal: typeof routes['driver.wallet.initiate_wallet_withdrawal']
    }
    dashboard: {
      fetchBookingsMetrics: typeof routes['driver.dashboard.fetch_bookings_metrics']
    }
  }
  common: {
    location: {
      fetchCities: typeof routes['common.location.fetch_cities']
    }
    finance: {
      fetchBanks: typeof routes['common.finance.fetch_banks']
      processPaystackWebhook: typeof routes['common.finance.process_paystack_webhook']
    }
    vehicle: {
      fetchVehicleModels: typeof routes['common.vehicle.fetch_vehicle_models']
      fetchVehicleMakesControllers: typeof routes['common.vehicle.fetch_vehicle_makes_controllers']
    }
    media: {
      uploadImage: typeof routes['common.media.upload_image']
    }
    bookings: {
      fetchRideTypes: typeof routes['common.bookings.fetch_ride_types']
      fetchPopularLocations: typeof routes['common.bookings.fetch_popular_locations']
    }
  }
}
