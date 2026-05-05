import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fetchBookingsRequestSchema = vine.object({
  page: vine.number().min(1).optional(),
  limit: vine.number().max(100).optional(),
})

const messages = {}

const FetchBookingsRequestValidator = vine.compile(fetchBookingsRequestSchema)

FetchBookingsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default FetchBookingsRequestValidator
