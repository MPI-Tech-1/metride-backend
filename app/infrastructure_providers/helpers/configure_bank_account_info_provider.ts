import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import payoutConfig from '#config/payout_config'
import BankAccountInfoProviderFactory from '#infrastructure_providers/factories/bank_account_info_provider_factory'
import type BankAccountInfoInterface from '#infrastructure_providers/type_checkings/bank_account_info/bank_account_info_interface'

export default function configureBankAccountInfoProvider() {
  const currentProvider = payoutConfig.currentProvider

  const provider = new BankAccountInfoProviderFactory(currentProvider).build()

  if (provider === SERVICE_PROVIDER_NOT_PROFILED) {
    throw new Error(SERVICE_PROVIDER_NOT_PROFILED)
  }

  return provider as BankAccountInfoInterface
}
