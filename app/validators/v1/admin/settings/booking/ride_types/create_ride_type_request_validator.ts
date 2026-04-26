import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const createRideTypeRequestSchema = vine.object({
  name: vine.string().unique({ table: 'ride_types', column: 'name' }),
  description: vine.string().optional(),
  numberOfSeats: vine.number().min(1),
  pricePerKilometer: vine.number().min(0),
  basePrice: vine.number().min(0),
  minimumPrice: vine.number().min(0),
})

const messages = {
  'name.required': 'Ride type name is required',
  'name.unique': 'Ride type name already exists',
  'numberOfSeats.required': 'Number of seats is required',
  'numberOfSeats.min': 'Number of seats must be at least 1',
  'pricePerKilometer.required': 'Price per kilometer is required',
  'basePrice.required': 'Base price is required',
  'minimumPrice.required': 'Minimum price is required',
}

const CreateRideTypeRequestValidator = vine.compile(createRideTypeRequestSchema)

CreateRideTypeRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreateRideTypeRequestValidator
