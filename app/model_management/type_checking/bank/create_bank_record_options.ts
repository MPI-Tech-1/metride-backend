import BankInterface from '#model_management/type_checking/bank/bank_interface'
import CreateNewRecordGeneric from '#common/type_checkings/model_management/create_new_record_generic'

type CreateBankRecordPayload = Partial<BankInterface>

type CreateBankRecordOptions = CreateNewRecordGeneric<CreateBankRecordPayload>

export default CreateBankRecordOptions
