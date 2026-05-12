import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import PaystackPayoutProvider from '#infrastructure_providers/externals/payout/paystack_payout_provider'
import type PayoutInterface from '#infrastructure_providers/type_checkings/payout/payout_interface'

export default class PayoutProviderFactory {
  /**
   *
   */
  constructor(private provider: string) {}

  public build(): PayoutInterface | string {
    if (this.provider === 'paystack') {
      return new PaystackPayoutProvider()
    }

    return SERVICE_PROVIDER_NOT_PROFILED
  }
}
