import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type BankIdentifierOptions from '#model_management/type_checking/bank/bank_identifier_options'
import type BankInterface from '#model_management/type_checking/bank/bank_interface'

type UpdateBankRecordOptions = UpdateRecordGeneric<BankIdentifierOptions, Partial<BankInterface>>

export default UpdateBankRecordOptions
