import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateVehicleInformationRequestSchema = vine.object({
  vehicleMakeIdentifier: vine.string().exists(async (db, value) => {
    const result = await db.from('vehicle_makes').select('*').where('identifier', value).first()
    return result ? true : false
  }),
  vehicleModelIdentifier: vine.string().exists(async (db, value) => {
    const result = await db.from('vehicle_models').select('*').where('identifier', value).first()
    return result ? true : false
  }),
  colorOfVehicle: vine.string().trim(),
  plateNumber: vine.string().trim().escape(),
  seatCapacity: vine.number(),
  typeOfVehicle: vine.string().trim().escape(),
})

const messages = {
  'vehicleMakeIdentifier.required': 'Vehicle make is required',
  'vehicleMakeIdentifier.string': 'Vehicle make must be a valid string',
  'vehicleMakeIdentifier.exists': 'Selected vehicle make does not exist',

  'vehicleModelIdentifier.required': 'Vehicle model is required',
  'vehicleModelIdentifier.string': 'Vehicle model must be a valid string',
  'vehicleModelIdentifier.exists': 'Selected vehicle model does not exist',

  'colorOfVehicle.required': 'Vehicle color is required',
  'colorOfVehicle.string': 'Vehicle color must be a valid string',

  'plateNumber.required': 'Plate number is required',
  'plateNumber.string': 'Plate number must be a valid string',

  'seatCapacity.required': 'Seat capacity is required',
  'seatCapacity.number': 'Seat capacity must be a number',

  'typeOfVehicle.required': 'Vehicle type is required',
  'typeOfVehicle.string': 'Vehicle type must be a valid string',
}

const UpdateVehicleInformationRequestValidator = vine.compile(updateVehicleInformationRequestSchema)

UpdateVehicleInformationRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateVehicleInformationRequestValidator
