import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateBankAccountRequestSchema = vine.object({
  bankIdentifier: vine
    .string()
    .trim()
    .exists(async (db, value) => {
      const results = await db.from('banks').select('*').where('identifier', value).first()

      return !!results
    }),

  accountName: vine.string().trim().escape().minLength(3),

  accountNumber: vine
    .string()
    .trim()
    .regex(/^\d+$/) // only digits
    .minLength(10)
    .maxLength(10), // Nigerian standard
})

const messages = {
  // Bank Identifier
  'bankIdentifier.required': 'Bank is required',
  'bankIdentifier.string': 'Bank identifier must be valid',
  'bankIdentifier.exists': 'Selected bank does not exist',

  // Account Name
  'accountName.required': 'Account name is required',
  'accountName.string': 'Account name must be valid',
  'accountName.minLength': 'Account name must be at least 3 characters',

  // Account Number
  'accountNumber.required': 'Account number is required',
  'accountNumber.string': 'Account number must be valid',
  'accountNumber.regex': 'Account number must contain only digits',
  'accountNumber.minLength': 'Account number must be 10 digits',
  'accountNumber.maxLength': 'Account number must be 10 digits',
}

const UpdateBankAccountRequestValidator = vine.compile(updateBankAccountRequestSchema)

UpdateBankAccountRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateBankAccountRequestValidator
