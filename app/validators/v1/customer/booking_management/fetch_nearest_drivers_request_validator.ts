import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fetchNearestDriversRequestSchema = vine.object({
  departure: vine.object({
    latitude: vine.number(),
    longitude: vine.number(),
  }),
  destination: vine.object({
    latitude: vine.number(),
    longitude: vine.number(),
  }),
})

const messages = {
  'departure.required': 'Please provide the departure location.',
  'departure.object': 'Departure must be a valid location object.',
  'departure.latitude.required': 'Please provide the departure latitude.',
  'departure.latitude.number': 'Departure latitude must be a valid number.',
  'departure.longitude.required': 'Please provide the departure longitude.',
  'departure.longitude.number': 'Departure longitude must be a valid number.',

  'destination.required': 'Please provide the destination location.',
  'destination.object': 'Destination must be a valid location object.',
  'destination.latitude.required': 'Please provide the destination latitude.',
  'destination.latitude.number': 'Destination latitude must be a valid number.',
  'destination.longitude.required': 'Please provide the destination longitude.',
  'destination.longitude.number': 'Destination longitude must be a valid number.',
}

const FetchNearestDriversRequestValidator = vine.compile(fetchNearestDriversRequestSchema)

FetchNearestDriversRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default FetchNearestDriversRequestValidator
