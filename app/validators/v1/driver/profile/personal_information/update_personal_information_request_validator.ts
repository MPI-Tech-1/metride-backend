import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updatePersonalInformationRequestSchema = vine.object({
  cityIdentifier: vine.string().exists(async (db, value) => {
    const result = await db.from('cities').select('*').where('identifier', value).first()
    return result ? true : false
  }),
  dateOfBirth: vine.date(),
  gender: vine.string().trim().escape(),
  homeAddress: vine.string().trim().escape(),
  nationalIdentificationNumber: vine.string().trim().escape(),
})

const messages = {
  // City Identifier
  'cityIdentifier.required': 'City is required',
  'cityIdentifier.string': 'City identifier must be a valid string',
  'cityIdentifier.exists': 'Selected city does not exist',

  // Date of Birth
  'dateOfBirth.required': 'Date of birth is required',
  'dateOfBirth.date': 'Date of birth must be a valid date',

  // Gender
  'gender.required': 'Gender is required',
  'gender.string': 'Gender must be a valid string',

  // Home Address
  'homeAddress.required': 'Home address is required',
  'homeAddress.string': 'Home address must be a valid string',

  // National Identification Number
  'nationalIdentificationNumber.required': 'National ID number is required',
  'nationalIdentificationNumber.string': 'National ID must be a valid string',
}

const UpdatePersonalInformationRequestValidator = vine.compile(
  updatePersonalInformationRequestSchema
)

UpdatePersonalInformationRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdatePersonalInformationRequestValidator
