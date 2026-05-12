import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import PaystackBankAccountInfoProvider from '#infrastructure_providers/externals/bank_account_info/paystack_bank_account_info_provider'
import type BankAccountInfoInterface from '#infrastructure_providers/type_checkings/bank_account_info/bank_account_info_interface'

class BankAccountInfoProviderFactory {
  protected CurrentProvider: string

  constructor(CurrentProvider: string) {
    this.CurrentProvider = CurrentProvider
  }

  /*
  |--------------------------------------------------------------------------
  | Instantiate the Current Provider
  |--------------------------------------------------------------------------
  |
  */
  public build(): BankAccountInfoInterface | string {
    if (this.CurrentProvider === 'paystack') {
      return new PaystackBankAccountInfoProvider()
    }

    return SERVICE_PROVIDER_NOT_PROFILED
  }
}

export default BankAccountInfoProviderFactory
