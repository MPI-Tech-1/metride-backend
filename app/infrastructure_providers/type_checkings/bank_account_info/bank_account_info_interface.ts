import type ResolveAccountInfoInputType from '#infrastructure_providers/type_checkings/bank_account_info/resolve_account_info_input_type'
import type ResolveAccountInfoOutputType from '#infrastructure_providers/type_checkings/bank_account_info/resolve_account_info_output_type'

export default interface BankAccountInfoInterface {
  verifyAccountDetails(
    resolveAccountInfoInputType: ResolveAccountInfoInputType
  ): Promise<ResolveAccountInfoOutputType | null>
}
