import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const createCityRequestSchema = vine.object({
  name: vine.string().unique({ table: 'cities', column: 'name' }),
  longitude: vine.string().optional(),
  latitude: vine.string().optional(),
})

const messages = {
  'name.required': 'City name is required',
  'name.unique': 'City name already exists',
}

const CreateCityRequestValidator = vine.compile(createCityRequestSchema)

CreateCityRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreateCityRequestValidator
