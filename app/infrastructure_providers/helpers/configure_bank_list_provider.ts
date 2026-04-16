import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import bankListConfig from '#config/bank_list_config'
import BankListFactory from '#infrastructure_providers/factories/bank_list_factory'
import BankListInterface from '#infrastructure_providers/type_checkings/bank_list/bank_list_interface'

export default function configureBankListProvider(): BankListInterface {
  const provider = new BankListFactory(bankListConfig.currentProvider).build()

  if (provider === SERVICE_PROVIDER_NOT_PROFILED) {
    throw new Error(SERVICE_PROVIDER_NOT_PROFILED)
  }

  return provider as BankListInterface
}
