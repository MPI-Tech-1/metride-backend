import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const submitBookingReviewRequestSchema = vine.object({
  rating: vine.number().min(1).max(5),
  review: vine.string(),
})

const messages = {}

const SubmitBookingReviewRequestValidator = vine.compile(submitBookingReviewRequestSchema)

SubmitBookingReviewRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default SubmitBookingReviewRequestValidator
