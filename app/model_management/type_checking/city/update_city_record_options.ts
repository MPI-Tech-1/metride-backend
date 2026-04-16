import UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import CityIdentifierOptions from '#model_management/type_checking/city/city_identifier_options'
import CityInterface from '#model_management/type_checking/city/city_interface'

type UpdateCityRecordOptions = UpdateRecordGeneric<CityIdentifierOptions, Partial<CityInterface>>

export default UpdateCityRecordOptions
