import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateInvestorVehicleRequestSchema = vine.object({
  investorIdentifier: vine.string(),
  rideTypeIdentifier: vine.string(),
  vehicleMakeIdentifier: vine.string(),
  vehicleModelIdentifier: vine.string(),
  colorOfVehicle: vine.string(),
  plateNumber: vine.string(),
  seatCapacity: vine.number(),
  percentageShare: vine.number(),
})

const messages = {}

const UpdateInvestorVehicleRequestValidator = vine.compile(updateInvestorVehicleRequestSchema)

UpdateInvestorVehicleRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateInvestorVehicleRequestValidator
