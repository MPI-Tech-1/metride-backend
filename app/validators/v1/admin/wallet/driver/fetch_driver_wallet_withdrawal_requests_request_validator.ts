import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fetchDriverWalletWithdrawalRequestsRequestSchema = vine.object({
  driverIdentifier: vine.string().trim().optional(),
  page: vine.number().min(1).optional(),
  limit: vine.number().max(100).optional(),
  status: vine.enum(['pending', 'approved', 'rejected']).optional(),
})

const messages = {
  'driverIdentifier.required': 'Driver identifier is required.',
}

const FetchDriverWalletWithdrawalRequestsRequestValidator = vine.compile(
  fetchDriverWalletWithdrawalRequestsRequestSchema
)

FetchDriverWalletWithdrawalRequestsRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default FetchDriverWalletWithdrawalRequestsRequestValidator
