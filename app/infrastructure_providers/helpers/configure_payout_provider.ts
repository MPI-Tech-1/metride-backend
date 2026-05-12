import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import payoutConfig from '#config/payout_config'
import PayoutProviderFactory from '#infrastructure_providers/factories/payout_provider_factory'
import type PayoutInterface from '#infrastructure_providers/type_checkings/payout/payout_interface'

export default function configurePayoutProvider() {
  const currentProvider = payoutConfig.currentProvider

  const provider = new PayoutProviderFactory(currentProvider).build()

  if (provider === SERVICE_PROVIDER_NOT_PROFILED) {
    throw new Error(SERVICE_PROVIDER_NOT_PROFILED)
  }

  return provider as PayoutInterface
}
