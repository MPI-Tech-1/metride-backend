import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * All fields are optional — only the fields sent are updated.
 * Pass `{ meta: { customerIdentifier } }` to `validateUsing` so the unique
 * checks ignore the customer being edited.
 */
const updateCustomerRequestSchema = vine.object({
  firstName: vine.string().trim().escape().minLength(1).optional(),
  lastName: vine.string().trim().escape().minLength(1).optional(),
  email: vine
    .string()
    .trim()
    .email()
    .unique({
      table: 'customers',
      column: 'email',
      filter: (db, _value, field) => {
        db.whereNot('identifier', field.meta.customerIdentifier)
      },
    })
    .optional(),
  mobileNumber: vine
    .string()
    .trim()
    .escape()
    .unique({
      table: 'customers',
      column: 'mobile_number',
      filter: (db, _value, field) => {
        db.whereNot('identifier', field.meta.customerIdentifier)
      },
    })
    .optional(),
})

const messages = {
  'firstName.string': 'First name must be a valid string.',
  'firstName.minLength': 'First name cannot be empty.',
  'lastName.string': 'Last name must be a valid string.',
  'lastName.minLength': 'Last name cannot be empty.',
  'email.email': 'Please provide a valid email address.',
  'email.database.unique': 'This email is already registered to another customer.',
  'mobileNumber.string': 'Mobile number must be valid.',
  'mobileNumber.database.unique': 'This mobile number is already registered to another customer.',
}

const UpdateCustomerRequestValidator = vine
  .withMetaData<{ customerIdentifier: string }>()
  .compile(updateCustomerRequestSchema)

UpdateCustomerRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateCustomerRequestValidator
