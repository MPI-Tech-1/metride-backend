import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateDocumentsRequestSchema = vine.object({
  driverLicenceUrl: vine.string().trim(),
  passportPhotographUrl: vine.string().trim(),
  vehiclePaperUrl: vine.string().trim(),
  vehiclePhotoUrl: vine.string().trim(),
})

const messages = {
  'driverLicenceUrl.required': 'Driver licence document is required',
  'driverLicenceUrl.string': 'Driver licence URL must be a valid string',

  'passportPhotographUrl.required': 'Passport photograph is required',
  'passportPhotographUrl.string': 'Passport photograph URL must be a valid string',

  'vehiclePaperUrl.required': 'Vehicle paper document is required',
  'vehiclePaperUrl.string': 'Vehicle paper URL must be a valid string',

  'vehiclePhotoUrl.required': 'Vehicle photo is required',
  'vehiclePhotoUrl.string': 'Vehicle photo URL must be a valid string',
}

const UpdateDocumentsRequestValidator = vine.compile(updateDocumentsRequestSchema)

UpdateDocumentsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateDocumentsRequestValidator
