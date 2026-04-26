import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const listDriversRequestSchema = vine.object({
  page: vine.number().optional(),
  limit: vine.number().optional(),
  searchQuery: vine.string().trim().escape().optional(),
})

const messages = {}

const ListDriversRequestValidator = vine.compile(listDriversRequestSchema)

ListDriversRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default ListDriversRequestValidator
