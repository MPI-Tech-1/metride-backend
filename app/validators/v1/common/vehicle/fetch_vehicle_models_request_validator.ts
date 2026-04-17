import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fetchVehicleModelRequestSchema = vine.object({
  vehicleMakeIdentifier: vine.string().escape().trim().optional(),
})

const messages = {}

const FetchVehicleModelsRequestValidator = vine.compile(fetchVehicleModelRequestSchema)

FetchVehicleModelsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default FetchVehicleModelsRequestValidator
