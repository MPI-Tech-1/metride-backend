import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customerRequestResetPasswordOtpTokenRequestSchema = vine.object({
  emailAddress: vine.string().trim().escape().email(),
})

const messages = {}

const CustomerRequestResetPasswordOtpTokenRequestValidator = vine.compile(
  customerRequestResetPasswordOtpTokenRequestSchema
)

CustomerRequestResetPasswordOtpTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default CustomerRequestResetPasswordOtpTokenRequestValidator
