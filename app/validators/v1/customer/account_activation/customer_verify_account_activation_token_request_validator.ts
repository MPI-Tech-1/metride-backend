import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customerVerifyAccountActivationTokenRequestSchema = vine.object({
  emailAddress: vine.string().trim().escape().email(),
  token: vine.string().trim(),
})

const messages = {}

const CustomerVerifyAccountActivationTokenRequestValidator = vine.compile(
  customerVerifyAccountActivationTokenRequestSchema
)

CustomerVerifyAccountActivationTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default CustomerVerifyAccountActivationTokenRequestValidator
