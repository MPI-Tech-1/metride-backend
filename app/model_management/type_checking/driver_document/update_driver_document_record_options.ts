import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type DriverDocumentIdentifierOptions from '#model_management/type_checking/driver_document/driver_document_identifier_options'
import type DriverDocumentInterface from '#model_management/type_checking/driver_document/driver_document_interface'

type UpdateDriverDocumentRecordOptions = UpdateRecordGeneric<
  DriverDocumentIdentifierOptions,
  Partial<DriverDocumentInterface>
>

export default UpdateDriverDocumentRecordOptions
