import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const submitBookingReviewRequestSchema = vine.object({
  bookingIdentifier: vine.string().exists(async (db, value) => {
    const results = await db.from('bookings').select('*').where('identifier', value).first()

    return results ? true : false
  }),
  rating: vine.number().min(1).max(5),
  review: vine.string(),
})

const messages = {}

const SubmitBookingReviewRequestValidator = vine.compile(submitBookingReviewRequestSchema)

SubmitBookingReviewRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default SubmitBookingReviewRequestValidator
