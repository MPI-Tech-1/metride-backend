import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import AdminRoleEnum from '#common/enums/admin_role_enum'

const createAdminRequestSchema = vine.object({
  firstName: vine.string().trim().escape(),
  lastName: vine.string().trim().escape(),
  email: vine
    .string()
    .email()
    .trim()
    .unique(async (db, value) => {
      const existing = await db.from('admins').where('email', value).first()
      return !existing
    }),
  role: vine.enum(Object.values(AdminRoleEnum)),
})

const messages = {
  'firstName.required': 'First name is required',
  'lastName.required': 'Last name is required',
  'email.required': 'Email address is required',
  'email.email': 'Please enter a valid email address',
  'email.unique': 'An admin with this email address already exists',
  'role.required': 'Role is required',
  'role.enum': `Role must be one of: ${Object.values(AdminRoleEnum).join(', ')}`,
}

const CreateAdminRequestValidator = vine.compile(createAdminRequestSchema)

CreateAdminRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreateAdminRequestValidator
