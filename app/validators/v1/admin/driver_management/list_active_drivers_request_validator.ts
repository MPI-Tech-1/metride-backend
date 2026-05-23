import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const listActiveDriversRequestSchema = vine.object({
  page: vine.number().min(1).optional(),
  limit: vine.number().max(100).optional(),
})

const messages = {}

const ListActiveDriversRequestValidator = vine.compile(listActiveDriversRequestSchema)

ListActiveDriversRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default ListActiveDriversRequestValidator
