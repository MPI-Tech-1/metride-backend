/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
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
  }
}
