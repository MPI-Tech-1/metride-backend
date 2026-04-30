import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const listBookingsRequestSchema = vine.object({
  page: vine.number().optional(),
  limit: vine.number().optional(),
  searchQuery: vine.string().trim().escape().optional(),
  rideTypeId: vine.number().optional(),
  typeOfBooking: vine.enum(['instant', 'shuttle']).optional(),
  isRecurringBooking: vine.boolean().optional(),
})

const messages = {}

const ListBookingsRequestValidator = vine.compile(listBookingsRequestSchema)

ListBookingsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default ListBookingsRequestValidator
