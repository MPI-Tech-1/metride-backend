import type CityInterface from '#model_management/type_checking/city/city_interface'
import type CreateNewRecordGeneric from '#common/type_checkings/model_management/create_new_record_generic'

type CreateCityRecordPayload = Partial<CityInterface>

type CreateCityRecordOptions = CreateNewRecordGeneric<CreateCityRecordPayload>

export default CreateCityRecordOptions
