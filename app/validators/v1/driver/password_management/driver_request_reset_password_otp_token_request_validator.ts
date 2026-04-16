import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const driverRequestResetPasswordOtpTokenRequestSchema = vine.object({
  emailAddress: vine.string().trim().escape().email(),
})

const messages = {}

const DriverRequestResetPasswordOtpTokenRequestValidator = vine.compile(
  driverRequestResetPasswordOtpTokenRequestSchema
)

DriverRequestResetPasswordOtpTokenRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default DriverRequestResetPasswordOtpTokenRequestValidator
