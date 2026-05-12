import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateDriverLocationRequestSchema = vine.object({
  latitude: vine.string().trim(),
  longitude: vine.string().trim(),
})

const messages = {}

const UpdateDriverLocationRequestValidator = vine.compile(updateDriverLocationRequestSchema)

UpdateDriverLocationRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateDriverLocationRequestValidator
