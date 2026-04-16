import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateVehicleInformationRequestSchema = vine.object({
  vehicleMakeId: vine.number().optional(),
  vehicleModelId: vine.number().optional(),
  colorOfVehicle: vine.string().trim().escape().optional(),
  plateNumber: vine.string().trim().escape().optional(),
  seatCapacity: vine.number().optional(),
  typeOfVehicle: vine.string().trim().escape().optional(),
})

const messages = {}

const UpdateVehicleInformationRequestValidator = vine.compile(
  updateVehicleInformationRequestSchema
)

UpdateVehicleInformationRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateVehicleInformationRequestValidator
