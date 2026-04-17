import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const password = () => vine.string().minLength(8).maxLength(32)

const customerResetPasswordRequestSchema = vine.object({
  email: vine.string().trim().escape().email(),
  otpToken: vine.string().trim(),
  newPassword: password(),
  newPasswordConfirmation: password().sameAs('newPassword'),
})

const messages = {
  // Email
  'email.required': 'Email is required',
  'email.email': 'Please enter a valid email address',

  // OTP Token
  'otpToken.required': 'OTP token is required',
  'otpToken.string': 'OTP token must be a valid string',

  // New Password
  'newPassword.required': 'New password is required',
  'newPassword.minLength': 'New password must be at least 8 characters',
  'newPassword.maxLength': 'New password cannot exceed 32 characters',

  // Password Confirmation
  'newPasswordConfirmation.required': 'Please confirm your new password',
  'newPasswordConfirmation.sameAs': 'Passwords do not match',
}

const CustomerResetPasswordRequestValidator = vine.compile(customerResetPasswordRequestSchema)

CustomerResetPasswordRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CustomerResetPasswordRequestValidator
