import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import cardPaymentConfig from '#config/card_payment_config'
import CardPaymentFactory from '#infrastructure_providers/factories/card_payment_factory'
import type CardPaymentInterface from '#infrastructure_providers/type_checkings/card_payment/card_payment_interface'

export default function configureCardPaymentProvider(): CardPaymentInterface {
  const provider = new CardPaymentFactory(cardPaymentConfig.currentProvider).build()

  if (provider === SERVICE_PROVIDER_NOT_PROFILED) {
    throw new Error(SERVICE_PROVIDER_NOT_PROFILED)
  }

  return provider as CardPaymentInterface
}
