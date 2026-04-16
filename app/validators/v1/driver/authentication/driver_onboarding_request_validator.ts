import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const password = () => vine.string().minLength(8).maxLength(32)

const driverOnboardingRequestSchema = vine.object({
  firstName: vine.string().trim().escape(),
  lastName: vine.string().trim().escape(),
  emailAddress: vine
    .string()
    .trim()
    .escape()
    .email()
    .unique({ table: 'drivers', column: 'email' }),
  mobileNumber: vine.string().trim().escape(),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
  fcmToken: vine.string().trim().escape().optional(),
})

const messages = {}

const DriverOnboardingRequestValidator = vine.compile(driverOnboardingRequestSchema)

DriverOnboardingRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default DriverOnboardingRequestValidator
