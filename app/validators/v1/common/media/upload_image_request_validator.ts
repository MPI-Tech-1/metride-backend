import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const uploadImageRequestSchema = vine.object({
  image: vine.file({
    size: '2mb',
    extnames: ['jpg', 'jpeg', 'png', 'webp'],
  }),
})

const messages = {
  'folder.string': 'Folder must be a valid string',
  'image.file': 'Image must be a valid file',
  'image.size': 'Image size must not exceed 2mb',
  'image.extnames': 'Image must be a jpg, jpeg, png, or webp',
}

const UploadImageRequestValidator = vine.compile(uploadImageRequestSchema)
UploadImageRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)
export default UploadImageRequestValidator
