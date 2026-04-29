import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type BookingPaymentIdentifierOptions from '#model_management/type_checking/booking_payment/booking_payment_identifier_options'
import type BookingPaymentInterface from '#model_management/type_checking/booking_payment/booking_payment_interface'

type UpdateBookingPaymentRecordOptions = UpdateRecordGeneric<
  BookingPaymentIdentifierOptions,
  Partial<BookingPaymentInterface>
>

export default UpdateBookingPaymentRecordOptions
