import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const listBookingsRequestSchema = vine.object({
  page: vine.number().min(1).optional(),
  limit: vine.number().max(100).optional(),
  searchQuery: vine.string().trim().escape().optional(),
  customerIdentifier: vine.string().trim().escape().optional(),
  assignedDriverIdentifier: vine.string().trim().escape().optional(),
  typeOfBooking: vine.enum(['instant', 'shuttle']).optional(),
  isRecurringBooking: vine.boolean().optional(),
})

const messages = {}

const ListBookingsRequestValidator = vine.compile(listBookingsRequestSchema)

ListBookingsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default ListBookingsRequestValidator
