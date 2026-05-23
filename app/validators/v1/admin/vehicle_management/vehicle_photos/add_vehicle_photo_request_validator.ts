import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const addVehiclePhotoRequestSchema = vine.object({
  driverIdentifier: vine
    .string()
    .trim()
    .exists(async (db, value) => {
      const result = await db
        .from('drivers')
        .select('id')
        .where('identifier', value)
        .whereNull('deleted_at')
        .first()
      return !!result
    }),
  section: vine.enum(['front', 'side', 'back', 'interior']),
  photoUrl: vine.string().url().trim(),
})

const messages = {
  'driverIdentifier.required': 'Please provide a driver identifier.',
  'driverIdentifier.exists': 'The selected driver could not be found.',
  'section.required': 'Please specify the photo section.',
  'section.enum': 'Section must be one of: front, side, back, interior.',
  'photoUrl.required': 'Please provide a photo URL.',
  'photoUrl.url': 'Photo URL must be a valid URL.',
}

const AddVehiclePhotoRequestValidator = vine.compile(addVehiclePhotoRequestSchema)

AddVehiclePhotoRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default AddVehiclePhotoRequestValidator
