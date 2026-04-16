import configureBankListProvider from '#infrastructure_providers/helpers/configure_bank_list_provider'
import Bank from '#models/bank'
import { inject } from '@adonisjs/core'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class extends BaseSeeder {
  public async run() {
    const bankListProvider = configureBankListProvider()

    const providerBankList = await bankListProvider.listBanks()

    db.raw('SET FOREIGN_KEY_CHECKS = 0;')

    await Bank.truncate()

    await Bank.createMany(providerBankList)

    db.raw('SET FOREIGN_KEY_CHECKS = 1;')
  }
}
