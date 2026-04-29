import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type BookingIdentifierOptions from '#model_management/type_checking/booking/booking_identifier_options'
import type BookingInterface from '#model_management/type_checking/booking/booking_interface'

type UpdateBookingRecordOptions = UpdateRecordGeneric<
  BookingIdentifierOptions,
  Partial<BookingInterface>
>

export default UpdateBookingRecordOptions
