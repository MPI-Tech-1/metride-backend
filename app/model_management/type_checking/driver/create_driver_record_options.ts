import DriverInterface from '#model_management/type_checking/driver/driver_interface'
import CreateNewRecordGeneric from '#common/type_checkings/model_management/create_new_record_generic'

type CreateDriverRecordPayload = Partial<DriverInterface>

type CreateDriverRecordOptions = CreateNewRecordGeneric<CreateDriverRecordPayload>

export default CreateDriverRecordOptions
