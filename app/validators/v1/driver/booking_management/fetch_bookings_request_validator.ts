import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fetchBookingsRequestSchema = vine.object({
  page: vine.number().optional(),
  limit: vine.number().optional(),
  searchQuery: vine.string().trim().escape().optional(),
  status: vine
    .enum(['assigned-a-driver', 'accepted', 'completed', 'cancelled', 'rejected'])
    .optional(),
  typeOfBooking: vine.enum(['instant', 'shuttle']).optional(),
})

const messages = {}

const FetchBookingsRequestValidator = vine.compile(fetchBookingsRequestSchema)

FetchBookingsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default FetchBookingsRequestValidator
