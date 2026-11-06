import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * All fields are optional — only the fields sent are updated.
 * Pass `{ meta: { driverIdentifier } }` to `validateUsing` so the unique
 * checks ignore the driver being edited.
 */
const updateDriverRequestSchema = vine.object({
  firstName: vine.string().trim().escape().minLength(1).optional(),
  lastName: vine.string().trim().escape().minLength(1).optional(),
  email: vine
    .string()
    .trim()
    .email()
    .unique({
      table: 'drivers',
      column: 'email',
      filter: (db, _value, field) => {
        db.whereNot('identifier', field.meta.driverIdentifier)
      },
    })
    .optional(),
  mobileNumber: vine
    .string()
    .trim()
    .escape()
    .unique({
      table: 'drivers',
      column: 'mobile_number',
      filter: (db, _value, field) => {
        db.whereNot('identifier', field.meta.driverIdentifier)
      },
    })
    .optional(),
  cityIdentifier: vine.string().trim().exists({ table: 'cities', column: 'identifier' }).optional(),
  dateOfBirth: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
  gender: vine.string().trim().escape().optional(),
  homeAddress: vine.string().trim().escape().optional(),
  nationalIdentificationNumber: vine.string().trim().escape().optional(),
})

const messages = {
  'firstName.string': 'First name must be a valid string.',
  'firstName.minLength': 'First name cannot be empty.',
  'lastName.string': 'Last name must be a valid string.',
  'lastName.minLength': 'Last name cannot be empty.',
  'email.email': 'Please provide a valid email address.',
  'email.database.unique': 'This email is already registered to another driver.',
  'mobileNumber.string': 'Mobile number must be valid.',
  'mobileNumber.database.unique': 'This mobile number is already registered to another driver.',
  'cityIdentifier.database.exists': 'Selected city does not exist.',
  'dateOfBirth.date': 'Date of birth must be a valid date in the format YYYY-MM-DD.',
  'gender.string': 'Gender must be a valid string.',
  'homeAddress.string': 'Home address must be a valid string.',
  'nationalIdentificationNumber.string': 'National ID must be a valid string.',
}

const UpdateDriverRequestValidator = vine
  .withMetaData<{ driverIdentifier: string }>()
  .compile(updateDriverRequestSchema)

UpdateDriverRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateDriverRequestValidator
