import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateVehicleMakeRequestSchema = vine.object({
  name: vine.string(),
})

const messages = {
  'name.required': 'Vehicle make name is required',
}

const UpdateVehicleMakeRequestValidator = vine.compile(updateVehicleMakeRequestSchema)

UpdateVehicleMakeRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateVehicleMakeRequestValidator
