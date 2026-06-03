import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const createInvestorRequestSchema = vine.object({
  firstName: vine.string(),
  lastName: vine.string(),
  email: vine.string().email().unique({ table: 'investors', column: 'email' }),
  mobileNumber: vine.string(),
  address: vine.string().optional(),
})

const messages = {
  'firstName.required': 'First name is required',
  'lastName.required': 'Last name is required',
  'email.required': 'Email is required',
  'email.email': 'Please provide a valid email address',
  'email.unique': 'An investor with this email already exists',
  'mobileNumber.required': 'Mobile number is required',
}

const CreateInvestorRequestValidator = vine.compile(createInvestorRequestSchema)

CreateInvestorRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreateInvestorRequestValidator
