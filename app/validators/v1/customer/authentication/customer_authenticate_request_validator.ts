import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customerAuthenticateRequestSchema = vine.object({
  email: vine.string().trim().escape(),
  password: vine.string(),
})

const messages = {}

const CustomerAuthenticateRequestValidator = vine.compile(customerAuthenticateRequestSchema)

CustomerAuthenticateRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CustomerAuthenticateRequestValidator
