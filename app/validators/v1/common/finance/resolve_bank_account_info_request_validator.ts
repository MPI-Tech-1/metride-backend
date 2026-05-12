import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const resolveBankAccountInfoRequestSchema = vine.object({
  accountNumber: vine
    .string()
    .trim()
    .escape()
    .fixedLength(10)
    .regex(/^[\d]+$/),
  bankCode: vine.string().trim().escape(),
})

const messages = {}

const ResolveBankAccountInfoRequestValidator = vine.compile(resolveBankAccountInfoRequestSchema)

ResolveBankAccountInfoRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default ResolveBankAccountInfoRequestValidator
