import HttpClient from '#infrastructure_providers/internals/http_client'
import type BankAccountInfoInterface from '#infrastructure_providers/type_checkings/bank_account_info/bank_account_info_interface'
import type ResolveAccountInfoInputType from '#infrastructure_providers/type_checkings/bank_account_info/resolve_account_info_input_type'
import type ResolveAccountInfoOutputType from '#infrastructure_providers/type_checkings/bank_account_info/resolve_account_info_output_type'
import bankAccountInfoConfig from '#config/bank_account_info_config'
import logApplicationError from '#common/helper_functions/log_application_error'

class PaystackBankAccountInfoProvider implements BankAccountInfoInterface {
  private accountInfoEndpoint: string = bankAccountInfoConfig.paystack.endpoint
  private secretKey: string = bankAccountInfoConfig.paystack.secretKey

  public async verifyAccountDetails(
    resolveAccountInfoInputType: ResolveAccountInfoInputType
  ): Promise<ResolveAccountInfoOutputType | null> {
    try {
      const { accountNumber, bankCode } = resolveAccountInfoInputType

      const { apiResponse } = await HttpClient.get({
        endpointUrl: `${this.accountInfoEndpoint}?account_number=${accountNumber}&bank_code=${bankCode}`,
        headerOptions: {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.secretKey}`,
          },
        },
      })

      return {
        accountNumber: apiResponse.data.account_number,
        accountName: apiResponse.data.account_name,
        bankCode: bankCode,
        bankName: '',
      }
    } catch (validateAccountDetailsError) {
      await logApplicationError(validateAccountDetailsError)
      return null
    }
  }
}

export default PaystackBankAccountInfoProvider
