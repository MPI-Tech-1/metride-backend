import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateRideTypeRequestSchema = vine.object({
  name: vine.string().optional(),
  description: vine.string().optional(),
  numberOfSeats: vine.number().min(1).optional(),
  pricePerKilometer: vine.number().min(0).optional(),
  basePrice: vine.number().min(0).optional(),
  minimumPrice: vine.number().min(0).optional(),
})

const messages = {
  'numberOfSeats.min': 'Number of seats must be at least 1',
  'pricePerKilometer.min': 'Price per kilometer cannot be negative',
  'basePrice.min': 'Base price cannot be negative',
  'minimumPrice.min': 'Minimum price cannot be negative',
}

const UpdateRideTypeRequestValidator = vine.compile(updateRideTypeRequestSchema)

UpdateRideTypeRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateRideTypeRequestValidator
