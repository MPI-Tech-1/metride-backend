import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const driverRequestAccountActivationTokenRequestSchema = vine.object({
  emailAddress: vine.string().trim().escape().email(),
})

const messages = {}

const DriverRequestAccountActivationTokenRequestValidator = vine.compile(
  driverRequestAccountActivationTokenRequestSchema
)

DriverRequestAccountActivationTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default DriverRequestAccountActivationTokenRequestValidator
