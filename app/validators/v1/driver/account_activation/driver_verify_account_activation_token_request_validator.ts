import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const driverVerifyAccountActivationTokenRequestSchema = vine.object({
  emailAddress: vine.string().trim().escape().email(),
  token: vine.string().trim(),
})

const messages = {}

const DriverVerifyAccountActivationTokenRequestValidator = vine.compile(
  driverVerifyAccountActivationTokenRequestSchema
)

DriverVerifyAccountActivationTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default DriverVerifyAccountActivationTokenRequestValidator
