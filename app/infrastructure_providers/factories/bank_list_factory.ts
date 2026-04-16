import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import PaystackBankListProvider from '#infrastructure_providers/externals/bank_list/paystack_bank_list_provider'
import BankListInterface from '#infrastructure_providers/type_checkings/bank_list/bank_list_interface'

export default class BankListFactory {
  constructor(private provider: string) {}

  public build(): BankListInterface | string {
    if (this.provider === 'paystack') return new PaystackBankListProvider()

    return SERVICE_PROVIDER_NOT_PROFILED
  }
}
