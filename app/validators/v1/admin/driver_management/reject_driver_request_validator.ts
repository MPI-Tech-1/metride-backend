import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const rejectDriverRequestSchema = vine.object({
  reason: vine.string().trim().escape(),
})

const messages = {
  'reason.required': 'Rejection reason is required',
  'reason.string': 'Rejection reason must be a string',
}

const RejectDriverRequestValidator = vine.compile(rejectDriverRequestSchema)

RejectDriverRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default RejectDriverRequestValidator
