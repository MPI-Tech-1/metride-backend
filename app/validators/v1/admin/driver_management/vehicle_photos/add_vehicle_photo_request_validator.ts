import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const addVehiclePhotoRequestSchema = vine.object({
  section: vine.enum(['front', 'side', 'back', 'interior']),
  photoUrl: vine.string().url().trim(),
})

const messages = {
  'section.required': 'Please specify the photo section.',
  'section.enum': 'Section must be one of: front, side, back, interior.',
  'photoUrl.required': 'Please provide a photo URL.',
  'photoUrl.url': 'Photo URL must be a valid URL.',
}

const AddVehiclePhotoRequestValidator = vine.compile(addVehiclePhotoRequestSchema)

AddVehiclePhotoRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default AddVehiclePhotoRequestValidator
