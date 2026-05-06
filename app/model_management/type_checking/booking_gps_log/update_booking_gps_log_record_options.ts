import type BookingGpsLogInterface from '#model_management/type_checking/booking_gps_log/booking_gps_log_interface'
import type BookingGpsLogIdentifierOptions from '#model_management/type_checking/booking_gps_log/booking_gps_log_identifier_options'
import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'

type UpdateBookingGpsLogRecordPayload = Partial<BookingGpsLogInterface>

type UpdateBookingGpsLogRecordOptions = UpdateRecordGeneric<
  BookingGpsLogIdentifierOptions,
  UpdateBookingGpsLogRecordPayload
>

export default UpdateBookingGpsLogRecordOptions
