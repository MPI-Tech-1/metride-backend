import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type InvestorIdentifierOptions from '#model_management/type_checking/investor/investor_identifier_options'
import type InvestorInterface from '#model_management/type_checking/investor/investor_interface'

type UpdateInvestorRecordOptions = UpdateRecordGeneric<
  InvestorIdentifierOptions,
  Partial<InvestorInterface>
>

export default UpdateInvestorRecordOptions
