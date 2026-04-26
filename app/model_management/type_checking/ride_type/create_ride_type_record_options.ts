import RideTypeInterface from '#model_management/type_checking/ride_type/ride_type_interface'
import CreateNewRecordGeneric from '#common/type_checkings/model_management/create_new_record_generic'

type CreateRideTypeRecordPayload = Partial<RideTypeInterface>

type CreateRideTypeRecordOptions = CreateNewRecordGeneric<CreateRideTypeRecordPayload>

export default CreateRideTypeRecordOptions
