import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const driverVerifyAccountActivationTokenRequestSchema = vine.object({
  token: vine.string().trim(),
})

const messages = {
  'token.required': 'Token is required',
}

const DriverVerifyAccountActivationTokenRequestValidator = vine.compile(
  driverVerifyAccountActivationTokenRequestSchema
)

DriverVerifyAccountActivationTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default DriverVerifyAccountActivationTokenRequestValidator
