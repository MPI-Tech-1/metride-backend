import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const uploadDriverReferenceFormRequestSchema = vine.object({
  referenceFormUrl: vine.string().url().trim(),
})

const messages = {
  'referenceFormUrl.required': 'Please provide the reference form URL.',
  'referenceFormUrl.url': 'Reference form URL must be a valid URL.',
}

const UploadDriverReferenceFormRequestValidator = vine.compile(
  uploadDriverReferenceFormRequestSchema
)

UploadDriverReferenceFormRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UploadDriverReferenceFormRequestValidator
