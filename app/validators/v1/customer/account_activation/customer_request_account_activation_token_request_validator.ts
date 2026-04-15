import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customerRequestAccountActivationTokenRequestSchema = vine.object({
  emailAddress: vine.string().trim().escape().email(),
})

const messages = {}

const CustomerRequestAccountActivationTokenRequestValidator = vine.compile(
  customerRequestAccountActivationTokenRequestSchema
)

CustomerRequestAccountActivationTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default CustomerRequestAccountActivationTokenRequestValidator
