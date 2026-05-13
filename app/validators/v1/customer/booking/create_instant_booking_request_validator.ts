import { DATE_FORMAT } from '#common/messages/system_messages'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const createInstantBookingRequestSchema = vine.object({
  driverIdentifier: vine.string().exists(async (db, value) => {
    const result = await db
      .from('drivers')
      .select('*')
      .where('identifier', value)
      .where('status', 'approved')
      .where('is_driver_active_for_trip', 1)
      .whereNull('deleted_at')
      .first()
    return !!result
  }),

  departureLocationName: vine.string().trim().escape(),
  departureLocationGpsCoordinates: vine.string().trim().escape(),
  departureLocationType: vine.enum(['home', 'work', 'office', 'mall', 'market', 'others']),

  destinationLocationName: vine.string().trim().escape(),
  destinationLocationGpsCoordinates: vine.string().trim().escape(),
  destinationLocationType: vine.enum(['home', 'work', 'office', 'mall', 'market', 'others']),

  dateOfRide: vine.date({ formats: [DATE_FORMAT.toUpperCase()] }),
})

const messages = {
  'driverIdentifier.required': 'Please select a driver.',
  'driverIdentifier.exists':
    'The selected driver is unavailable or could not be found. Please choose another.',

  'departureLocationName.string': 'Pickup location name must be valid text.',
  'departureLocationGpsCoordinates.required': 'Please provide the pickup location coordinates.',
  'departureLocationGpsCoordinates.string': 'Pickup coordinates must be valid text.',
  'departureLocationType.required': 'Please select the type of pickup location.',
  'departureLocationType.enum':
    'Pickup location type is invalid. Use home, work, office, mall, market, or others.',

  'destinationLocationName.string': 'Destination name must be valid text.',
  'destinationLocationGpsCoordinates.required': 'Please provide the destination coordinates.',
  'destinationLocationGpsCoordinates.string': 'Destination coordinates must be valid text.',
  'destinationLocationType.required': 'Please select the destination type.',
  'destinationLocationType.enum':
    'Destination type is invalid. Use home, work, office, mall, market, or others.',

  'dateOfRide.required': 'Please select the date of your ride.',
  'dateOfRide.date': 'Date must be in the format YYYY-MM-DD.',
}

const CreateInstantBookingRequestValidator = vine.compile(createInstantBookingRequestSchema)

CreateInstantBookingRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreateInstantBookingRequestValidator
