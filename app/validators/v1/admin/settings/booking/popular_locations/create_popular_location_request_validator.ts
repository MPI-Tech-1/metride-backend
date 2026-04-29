import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const createPopularLocationRequestSchema = vine.object({
  cityIdentifier: vine.string().exists(async (db, value) => {
    const results = await db
      .from('popular_locations')
      .select('*')
      .where('identifier', value)
      .first()
    return results ? false : true
  }),
  name: vine.string().trim().escape(),
  gpsCoordinates: vine.string().trim().escape(),
  typeOfLocation: vine.string().trim().escape(),
  isActive: vine.boolean(),
})

const messages = {
  'cityIdentifier.required': 'City identifier is required',
  'cityIdentifier.exists': 'Selected city does not exist',
  'name.required': 'Location name is required',
  'gpsCoordinates.required': 'GPS coordinates are required',
  'typeOfLocation.required': 'Type of location is required',
}

const CreatePopularLocationRequestValidator = vine.compile(createPopularLocationRequestSchema)

CreatePopularLocationRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreatePopularLocationRequestValidator
