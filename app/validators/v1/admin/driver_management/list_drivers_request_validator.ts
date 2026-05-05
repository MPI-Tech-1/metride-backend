import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const listDriversRequestSchema = vine.object({
  page: vine.number().min(1).optional(),
  limit: vine.number().max(100).optional(),
  searchQuery: vine.string().trim().escape().optional(),
})

const messages = {}

const ListDriversRequestValidator = vine.compile(listDriversRequestSchema)

ListDriversRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default ListDriversRequestValidator
