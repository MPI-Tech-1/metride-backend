import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const createInvestorVehicleRequestSchema = vine.object({
  investorIdentifier: vine.string(),
  rideTypeIdentifier: vine.string(),
  vehicleMakeIdentifier: vine.string(),
  vehicleModelIdentifier: vine.string(),
  colorOfVehicle: vine.string(),
  plateNumber: vine.string(),
  seatCapacity: vine.number(),
  percentageShare: vine.number(),
})

const messages = {
  'investorIdentifier.required': 'Investor identifier is required',
  'percentageShare.required': 'Percentage share is required',
  'seatCapacity.required': 'Seat capacity is required',
}

const CreateInvestorVehicleRequestValidator = vine.compile(createInvestorVehicleRequestSchema)

CreateInvestorVehicleRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreateInvestorVehicleRequestValidator
