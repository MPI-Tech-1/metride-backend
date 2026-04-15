import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const password = () => vine.string().minLength(8).maxLength(32)

const customerResetPasswordRequestSchema = vine.object({
  emailAddress: vine.string().trim().escape().email(),
  otpToken: vine.string().trim(),
  newPassword: password(),
  newPasswordConfirmation: password().sameAs('newPassword'),
})

const messages = {}

const CustomerResetPasswordRequestValidator = vine.compile(customerResetPasswordRequestSchema)

CustomerResetPasswordRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CustomerResetPasswordRequestValidator
