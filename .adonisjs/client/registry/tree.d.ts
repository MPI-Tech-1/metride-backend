/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  onboarding: typeof routes['onboarding']
  authenticateCustomer: typeof routes['authenticate_customer']
}
