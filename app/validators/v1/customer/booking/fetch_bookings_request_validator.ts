import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fetchBookingsRequestSchema = vine.object({
  page: vine.number().optional(),
  limit: vine.number().optional(),
})

const messages = {}

const FetchBookingsRequestValidator = vine.compile(fetchBookingsRequestSchema)

FetchBookingsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default FetchBookingsRequestValidator
