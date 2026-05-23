import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateCityRequestSchema = vine.object({
  name: vine.string(),
  longitude: vine.string(),
  latitude: vine.string(),
})

const messages = {}

const UpdateCityRequestValidator = vine.compile(updateCityRequestSchema)

UpdateCityRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateCityRequestValidator
