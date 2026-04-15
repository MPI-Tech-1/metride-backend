/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  onboarding: typeof routes['onboarding']
  authenticateCustomer: typeof routes['authenticate_customer']
  requestAccountActivationToken: typeof routes['request_account_activation_token']
  verifyAccountActivationToken: typeof routes['verify_account_activation_token']
  requestResetPasswordOtpToken: typeof routes['request_reset_password_otp_token']
  resetPassword: typeof routes['reset_password']
}
