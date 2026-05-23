import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const createVehicleMakeRequestSchema = vine.object({
  name: vine.string().unique({ table: 'vehicle_makes', column: 'name' }),
})

const messages = {
  'name.required': 'Vehicle make name is required',
  'name.unique': 'Vehicle make name already exists',
}

const CreateVehicleMakeRequestValidator = vine.compile(createVehicleMakeRequestSchema)

CreateVehicleMakeRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreateVehicleMakeRequestValidator
