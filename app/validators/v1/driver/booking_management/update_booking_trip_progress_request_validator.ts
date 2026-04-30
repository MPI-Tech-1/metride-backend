import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateBookingTripProgressRequestSchema = vine.object({
  tripProgress: vine.enum([
    'heading-to-pickup',
    'arrived-at-pickup',
    'enroute-to-dropoff',
    'completed',
  ]),
})

const messages = {}

const UpdateBookingTripProgressRequestValidator = vine.compile(
  updateBookingTripProgressRequestSchema
)

UpdateBookingTripProgressRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateBookingTripProgressRequestValidator
