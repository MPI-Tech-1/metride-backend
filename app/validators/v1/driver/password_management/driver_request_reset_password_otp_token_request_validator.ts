import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const driverRequestResetPasswordOtpTokenRequestSchema = vine.object({
  email: vine.string().trim().escape().email(),
})

const messages = {
  'email.required': 'Email address is required',
  'email.email': 'Please enter a valid email address',
}

const DriverRequestResetPasswordOtpTokenRequestValidator = vine.compile(
  driverRequestResetPasswordOtpTokenRequestSchema
)

DriverRequestResetPasswordOtpTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default DriverRequestResetPasswordOtpTokenRequestValidator
