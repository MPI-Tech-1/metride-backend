import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateDriverCommissionRequestSchema = vine.object({
  commissionPercentage: vine.number().min(0).max(100),
})

const messages = {
  'commissionPercentage.required': 'Please provide a commission percentage.',
  'commissionPercentage.number': 'Commission percentage must be a valid number.',
  'commissionPercentage.min': 'Commission percentage cannot be less than 0.',
  'commissionPercentage.max': 'Commission percentage cannot exceed 100.',
}

const UpdateDriverCommissionRequestValidator = vine.compile(updateDriverCommissionRequestSchema)

UpdateDriverCommissionRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateDriverCommissionRequestValidator
