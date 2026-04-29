import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type PopularLocationIdentifierOptions from '#model_management/type_checking/popular_location/popular_location_identifier_options'
import type PopularLocationInterface from '#model_management/type_checking/popular_location/popular_location_interface'

type UpdatePopularLocationRecordOptions = UpdateRecordGeneric<
  PopularLocationIdentifierOptions,
  Partial<PopularLocationInterface>
>

export default UpdatePopularLocationRecordOptions
