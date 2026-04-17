import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customerVerifyAccountActivationTokenRequestSchema = vine.object({
  token: vine.string().trim().escape(),
})

const messages = {
  'token.required': 'Token is required',
}

const CustomerVerifyAccountActivationTokenRequestValidator = vine.compile(
  customerVerifyAccountActivationTokenRequestSchema
)

CustomerVerifyAccountActivationTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default CustomerVerifyAccountActivationTokenRequestValidator
