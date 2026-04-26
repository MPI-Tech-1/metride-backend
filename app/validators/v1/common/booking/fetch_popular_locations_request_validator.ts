import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fetchPopularLocationsRequestSchema = vine.object({
  cityIdentifier: vine.string().escape().trim().optional(),
})

const messages = {}

const FetchPopularLocationsRequestValidator = vine.compile(fetchPopularLocationsRequestSchema)

FetchPopularLocationsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default FetchPopularLocationsRequestValidator
