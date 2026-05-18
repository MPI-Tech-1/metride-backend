import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateVehicleModelRequestSchema = vine.object({
  name: vine.string(),
  vehicleMakeIdentifier: vine.string().exists(async (db, value) => {
    const vehicleMake = await db.from('vehicle_makes').where('identifier', value).first()
    return vehicleMake ? true : false
  }),
})

const messages = {
  'name.required': 'Vehicle model name is required',
  'vehicleMakeIdentifier.required': 'Vehicle make identifier is required',
  'vehicleMakeIdentifier.exists': 'Selected vehicle make does not exist',
}

const UpdateVehicleModelRequestValidator = vine.compile(updateVehicleModelRequestSchema)

UpdateVehicleModelRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateVehicleModelRequestValidator
