import configureBankListProvider from '#infrastructure_providers/helpers/configure_bank_list_provider'
import Bank from '#models/bank'
import { inject } from '@adonisjs/core'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

@inject()
export default class extends BaseSeeder {
  public async run() {
    const bankListProvider = configureBankListProvider()

    const providerBankList = await bankListProvider.listBanks()

    if (providerBankList.length === 0) {
      throw new Error('Bank provider returned an empty list. Existing bank records were preserved.')
    }

    for (const bank of providerBankList) {
      await Bank.updateOrCreate({ bankCode: bank.bankCode }, bank)
    }
  }
}
