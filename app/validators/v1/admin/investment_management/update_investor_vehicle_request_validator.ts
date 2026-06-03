import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const updateInvestorVehicleRequestSchema = vine.object({
  investorId: vine.number(),
  vehicleName: vine.string(),
  vehicleType: vine.string(),
  plateNumber: vine.string(),
  investmentAmount: vine.number(),
  percentageShare: vine.number(),
})

const messages = {}

const UpdateInvestorVehicleRequestValidator = vine.compile(updateInvestorVehicleRequestSchema)

UpdateInvestorVehicleRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default UpdateInvestorVehicleRequestValidator
