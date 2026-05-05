import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fetchWalletTransactionsRequestSchema = vine.object({
  page: vine.number().optional(),
  limit: vine.number().optional(),
  typeOfTransaction: vine.enum(['debit', 'credit']).optional(),
  status: vine.enum(['pending', 'completed', 'failed']).optional(),
})

const messages = {}

const FetchWalletTransactionsRequestValidator = vine.compile(fetchWalletTransactionsRequestSchema)

FetchWalletTransactionsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default FetchWalletTransactionsRequestValidator
