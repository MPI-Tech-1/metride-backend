import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const listCustomersRequestSchema = vine.object({
  page: vine.number().min(1).optional(),
  limit: vine.number().max(100).optional(),
  searchQuery: vine.string().trim().escape().optional(),
})

const messages = {}

const ListCustomersRequestValidator = vine.compile(listCustomersRequestSchema)

ListCustomersRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default ListCustomersRequestValidator
