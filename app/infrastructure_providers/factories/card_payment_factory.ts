import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import PaystackCardPaymentProvider from '#infrastructure_providers/externals/card_payment/paystack_card_payment_provider'
import type CardPaymentInterface from '#infrastructure_providers/type_checkings/card_payment/card_payment_interface'

export default class CardPaymentFactory {
  constructor(private provider: string) {}

  public build(): CardPaymentInterface | string {
    if (this.provider === 'paystack') return new PaystackCardPaymentProvider()

    return SERVICE_PROVIDER_NOT_PROFILED
  }
}
