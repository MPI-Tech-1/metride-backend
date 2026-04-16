import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const driverAuthenticateRequestSchema = vine.object({
  email: vine.string().trim().escape(),
  password: vine.string(),
})

const messages = {}

const DriverAuthenticateRequestValidator = vine.compile(driverAuthenticateRequestSchema)

DriverAuthenticateRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default DriverAuthenticateRequestValidator
