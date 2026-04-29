import type BookingInterface from '#model_management/type_checking/booking/booking_interface'
import type CreateNewRecordGeneric from '#common/type_checkings/model_management/create_new_record_generic'

type CreateBookingRecordPayload = Partial<BookingInterface>

type CreateBookingRecordOptions = CreateNewRecordGeneric<CreateBookingRecordPayload>

export default CreateBookingRecordOptions
