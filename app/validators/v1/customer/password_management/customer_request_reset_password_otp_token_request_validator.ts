import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customerRequestResetPasswordOtpTokenRequestSchema = vine.object({
  email: vine.string().trim().escape().email(),
})

const messages = {
  'email.required': 'Email address is required',
  'email.email': 'Please enter a valid email address',
}

const CustomerRequestResetPasswordOtpTokenRequestValidator = vine.compile(
  customerRequestResetPasswordOtpTokenRequestSchema
)

CustomerRequestResetPasswordOtpTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default CustomerRequestResetPasswordOtpTokenRequestValidator
