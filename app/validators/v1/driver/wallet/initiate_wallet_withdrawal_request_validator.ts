import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const initiateWalletWithdrawalRequestSchema = vine.object({
  amount: vine.number().positive().min(1),
})

const messages = {
  'amount.required': 'Withdrawal amount is required.',
  'amount.positive': 'Withdrawal amount must be a positive number.',
  'amount.min': 'Withdrawal amount must be at least 1.',
}

const InitiateWalletWithdrawalRequestValidator = vine.compile(
  initiateWalletWithdrawalRequestSchema
)

InitiateWalletWithdrawalRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default InitiateWalletWithdrawalRequestValidator
