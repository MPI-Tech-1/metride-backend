import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fetchDriverWalletTransactionsRequestSchema = vine.object({
  driverIdentifier: vine.string().trim().optional(),
  page: vine.number().optional(),
  limit: vine.number().optional(),
  typeOfTransaction: vine.enum(['debit', 'credit']).optional(),
  status: vine.enum(['pending', 'completed', 'failed']).optional(),
})

const messages = {
  'driverIdentifier.required': 'Driver identifier is required.',
}

const FetchDriverWalletTransactionsRequestValidator = vine.compile(
  fetchDriverWalletTransactionsRequestSchema
)

FetchDriverWalletTransactionsRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default FetchDriverWalletTransactionsRequestValidator
