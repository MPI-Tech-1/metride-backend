import { DATE_FORMAT } from '#common/messages/system_messages'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const createShuttleBookingRequestSchema = vine.object({
  departureLocationName: vine.string().trim().escape(),
  departureLocationGpsCoordinates: vine.string().trim().escape(),
  departureLocationType: vine.enum(['home', 'work', 'office', 'mall', 'market', 'others']),

  destinationLocationName: vine.string().trim().escape(),
  destinationLocationGpsCoordinates: vine.string().trim().escape(),
  destinationLocationType: vine.enum(['home', 'work', 'office', 'mall', 'market', 'others']),

  rideTypeIdentifier: vine.string().exists(async (db, value) => {
    const result = await db.from('ride_types').select('id').where('identifier', value).first()
    return !!result
  }),

  isRecurringBooking: vine.boolean(),

  dateOfRide: vine
    .date({ formats: [DATE_FORMAT.toUpperCase()] })
    .optional()
    .requiredWhen('isRecurringBooking', '=', false),

  recurringBookingDates: vine
    .object({
      durationInWeeks: vine.number().min(1),
      days: vine
        .array(
          vine.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
        )
        .minLength(1),
    })
    .optional()
    .requiredWhen('isRecurringBooking', '=', true),
})

const messages = {
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

  'rideTypeIdentifier.required': 'Please select a ride type.',
  'rideTypeIdentifier.exists': 'The selected ride type could not be found. Please try another one.',

  'isRecurringBooking.required': 'Please specify if this is a recurring booking.',
  'isRecurringBooking.boolean': 'Recurring booking must be true or false.',

  'dateOfRide.required': 'Please select the date of your ride.',
  'dateOfRide.date': 'Date must be in the format YYYY-MM-DD.',

  'recurringBookingDates.required': 'Please provide your recurring booking schedule.',
  'recurringBookingDates.object': 'Recurring booking details must be valid.',

  'recurringBookingDates.durationInWeeks.required':
    'Please specify how many weeks this booking should repeat.',
  'recurringBookingDates.durationInWeeks.number': 'Duration must be a valid number.',
  'recurringBookingDates.durationInWeeks.min': 'Duration must be at least 1 week.',

  'recurringBookingDates.days.required':
    'Please select at least one day for the recurring booking.',
  'recurringBookingDates.days.array': 'Days must be provided as a list.',
  'recurringBookingDates.days.minLength': 'Please select at least one day.',
  'recurringBookingDates.days.enum': 'One or more selected days are invalid.',
}

const CreateShuttleBookingRequestValidator = vine.compile(createShuttleBookingRequestSchema)

CreateShuttleBookingRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreateShuttleBookingRequestValidator
