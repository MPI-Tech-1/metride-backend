import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const adminAuthenticateRequestSchema = vine.object({
  email: vine.string().trim().escape(),
  password: vine.string(),
})

const messages = {
  'email.required': 'Email address is required',
  'email.email': 'Please enter a valid email address',
  'password.required': 'Password is required',
}

const AdminAuthenticateRequestValidator = vine.compile(adminAuthenticateRequestSchema)

AdminAuthenticateRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default AdminAuthenticateRequestValidator
