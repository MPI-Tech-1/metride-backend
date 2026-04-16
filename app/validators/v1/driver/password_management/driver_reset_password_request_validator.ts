import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const password = () => vine.string().minLength(8).maxLength(32)

const driverResetPasswordRequestSchema = vine.object({
  emailAddress: vine.string().trim().escape().email(),
  otpToken: vine.string().trim(),
  newPassword: password(),
  newPasswordConfirmation: password().sameAs('newPassword'),
})

const messages = {}

const DriverResetPasswordRequestValidator = vine.compile(driverResetPasswordRequestSchema)

DriverResetPasswordRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default DriverResetPasswordRequestValidator
