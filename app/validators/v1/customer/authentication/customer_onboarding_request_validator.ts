import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const password = () => vine.string().minLength(8).maxLength(32)

const customerOnboardingRequestSchema = vine.object({
  firstName: vine.string().trim().escape(),
  lastName: vine.string().trim().escape(),
  email: vine
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

const messages = {
  // First Name
  'firstName.required': 'First name is required',
  'firstName.string': 'First name must be a valid string',

  // Last Name
  'lastName.required': 'Last name is required',
  'lastName.string': 'Last name must be a valid string',

  // Email
  'email.required': 'Email address is required',
  'email.email': 'Please enter a valid email address',
  'email.unique': 'This email is already registered',

  // Mobile Number
  'mobileNumber.required': 'Mobile number is required',
  'mobileNumber.string': 'Mobile number must be valid',

  // Password
  'password.required': 'Password is required',
  'password.minLength': 'Password must be at least 8 characters',
  'password.maxLength': 'Password cannot exceed 32 characters',

  // Password Confirmation
  'passwordConfirmation.required': 'Please confirm your password',
  'passwordConfirmation.sameAs': 'Passwords do not match',

  // FCM Token (optional but still validated if present)
  'fcmToken.string': 'FCM token must be a valid string',
}

const CustomerOnboardingRequestValidator = vine.compile(customerOnboardingRequestSchema)

CustomerOnboardingRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CustomerOnboardingRequestValidator
