import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const adminRequestResetPasswordOtpTokenRequestSchema = vine.object({
  email: vine.string().email().trim().escape(),
})

const messages = {
  'email.required': 'Email address is required',
  'email.email': 'Please enter a valid email address',
}

const AdminRequestResetPasswordOtpTokenRequestValidator = vine.compile(
  adminRequestResetPasswordOtpTokenRequestSchema
)

AdminRequestResetPasswordOtpTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default AdminRequestResetPasswordOtpTokenRequestValidator
