import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const password = () => vine.string().minLength(8).maxLength(32)

const customerOnboardingRequestSchema = vine.object({
  firstName: vine.string().trim().escape(),
  lastName: vine.string().trim().escape(),
  emailAddress: vine
    .string()
    .trim()
    .escape()
    .email()
    .unique({ table: 'customers', column: 'mobile_number' }),
  mobileNumber: vine.string().trim().escape(),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
  fcmToken: vine.string().trim().escape().optional(),
})

const messages = {}

const CustomerOnboardingRequestValidator = vine.compile(customerOnboardingRequestSchema)

CustomerOnboardingRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CustomerOnboardingRequestValidator
