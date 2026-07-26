import type CreateNewRecordGeneric from '#common/type_checkings/model_management/create_new_record_generic'
import type InvestorInterface from '#model_management/type_checking/investor/investor_interface'

type CreateInvestorRecordPayload = Partial<InvestorInterface>

type CreateInvestorRecordOptions = CreateNewRecordGeneric<CreateInvestorRecordPayload>

export default CreateInvestorRecordOptions
