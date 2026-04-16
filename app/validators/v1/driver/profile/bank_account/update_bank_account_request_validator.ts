import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateBankAccountRequestSchema = vine.object({
  bankIdentifier: vine.string().exists(async (db, value) => {
    const results = await db.from('banks').select('*').where('identifier', value).first()

    return results ? true : false
  }),
  accountName: vine.string().trim().escape(),
  accountNumber: vine.string().trim().escape(),
})

const messages = {}

const UpdateBankAccountRequestValidator = vine.compile(updateBankAccountRequestSchema)

UpdateBankAccountRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateBankAccountRequestValidator
