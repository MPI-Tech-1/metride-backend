import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateInvestorRequestSchema = vine.object({
  firstName: vine.string(),
  lastName: vine.string(),
  email: vine.string().email(),
  mobileNumber: vine.string(),
  address: vine.string(),
})

const messages = {
  'email.email': 'Please provide a valid email address',
}

const UpdateInvestorRequestValidator = vine.compile(updateInvestorRequestSchema)

UpdateInvestorRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateInvestorRequestValidator
