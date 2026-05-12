import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateCustomerProfileRequestSchema = vine.object({
  firstName: vine.string().trim().escape().minLength(1).maxLength(120),
  lastName: vine.string().trim().escape().minLength(1).maxLength(120),
  mobileNumber: vine.string().trim().escape().minLength(8).maxLength(20),
})

const messages = {
  'firstName.required': 'First name is required',
  'firstName.minLength': 'First name is required',
  'firstName.maxLength': 'First name is too long',

  'lastName.required': 'Last name is required',
  'lastName.minLength': 'Last name is required',
  'lastName.maxLength': 'Last name is too long',

  'mobileNumber.required': 'Mobile number is required',
  'mobileNumber.minLength': 'Mobile number is too short',
  'mobileNumber.maxLength': 'Mobile number is too long',
}

const UpdateCustomerProfileRequestValidator = vine.compile(updateCustomerProfileRequestSchema)

UpdateCustomerProfileRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateCustomerProfileRequestValidator
