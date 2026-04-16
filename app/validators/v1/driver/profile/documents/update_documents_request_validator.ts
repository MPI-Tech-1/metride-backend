import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateDocumentsRequestSchema = vine.object({
  driverLicenceUrl: vine.string().trim(),
  passportPhotographUrl: vine.string().trim(),
  vehiclePaperUrl: vine.string().trim(),
  vehiclePhotoUrl: vine.string().trim(),
})

const messages = {}

const UpdateDocumentsRequestValidator = vine.compile(updateDocumentsRequestSchema)

UpdateDocumentsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateDocumentsRequestValidator
