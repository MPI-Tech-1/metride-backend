import bankListConfig from '#config/bank_list_config'
import HttpClient from '#infrastructure_providers/internals/http_client'
import { type Bank } from '#infrastructure_providers/type_checkings/bank_list/bank_list_interface'
import type BankListInterface from '#infrastructure_providers/type_checkings/bank_list/bank_list_interface'

export default class PaystackBankListProvider implements BankListInterface {
  private endpoint: string = bankListConfig.paystack.endpoint
  private secretKey: string = bankListConfig.paystack.secretKey

  public async listBanks(): Promise<Bank[]> {
    try {
      const { apiResponse } = await HttpClient.get({
        endpointUrl: this.endpoint,
        headerOptions: {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      })

      return apiResponse.data.map((bank: Record<string, any>) => {
        return {
          name: bank.name,
        }
      })
    } catch (listBanksError) {
      return []
    }
  }
}
