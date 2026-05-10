import type BookingReviewInterface from '#model_management/type_checking/booking_review/booking_review_interface'
import type BookingReviewIdentifierOptions from '#model_management/type_checking/booking_review/booking_review_identifier_options'
import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'

type UpdateBookingReviewRecordPayload = Partial<BookingReviewInterface>

type UpdateBookingReviewRecordOptions = UpdateRecordGeneric<
  BookingReviewIdentifierOptions,
  UpdateBookingReviewRecordPayload
>

export default UpdateBookingReviewRecordOptions
