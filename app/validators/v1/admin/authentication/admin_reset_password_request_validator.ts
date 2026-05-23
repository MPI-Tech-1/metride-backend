import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const adminResetPasswordRequestSchema = vine.object({
  email: vine.string().email().trim().escape(),
  otpToken: vine.string().trim(),
  newPassword: vine.string().minLength(8),
})

const messages = {
  'email.required': 'Email address is required',
  'email.email': 'Please enter a valid email address',
  'otpToken.required': 'OTP token is required',
  'newPassword.required': 'New password is required',
  'newPassword.minLength': 'Password must be at least 8 characters long',
}

const AdminResetPasswordRequestValidator = vine.compile(adminResetPasswordRequestSchema)

AdminResetPasswordRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default AdminResetPasswordRequestValidator
