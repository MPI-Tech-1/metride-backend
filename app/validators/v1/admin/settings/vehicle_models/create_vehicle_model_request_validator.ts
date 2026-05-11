import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const createVehicleModelRequestSchema = vine.object({
  name: vine.string(),
  vehicleMakeIdentifier: vine.string().exists(async (db, value) => {
    const vehicleMake = await db
      .from('vehicle_makes')
      .where('identifier', value)
      .first()
    return vehicleMake ? true : false
  }),
})

const messages = {
  'name.required': 'Vehicle model name is required',
  'vehicleMakeIdentifier.required': 'Vehicle make identifier is required',
  'vehicleMakeIdentifier.exists': 'Selected vehicle make does not exist',
}

const CreateVehicleModelRequestValidator = vine.compile(createVehicleModelRequestSchema)

CreateVehicleModelRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreateVehicleModelRequestValidator
