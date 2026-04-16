import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updatePersonalInformationRequestSchema = vine.object({
  cityId: vine.number().optional(),
  dateOfBirth: vine.date().optional(),
  gender: vine.string().trim().escape().optional(),
  homeAddress: vine.string().trim().escape().optional(),
  nationalIdentificationNumber: vine.string().trim().escape().optional(),
})

const messages = {}

const UpdatePersonalInformationRequestValidator = vine.compile(
  updatePersonalInformationRequestSchema
)

UpdatePersonalInformationRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdatePersonalInformationRequestValidator
