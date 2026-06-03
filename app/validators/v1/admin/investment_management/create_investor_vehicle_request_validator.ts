import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const createInvestorVehicleRequestSchema = vine.object({
  investorId: vine.number(),
  vehicleName: vine.string(),
  vehicleType: vine.string(),
  plateNumber: vine.string().optional(),
  investmentAmount: vine.number(),
  percentageShare: vine.number(),
})

const messages = {
  'investorId.required': 'Investor is required',
  'vehicleName.required': 'Vehicle name is required',
  'vehicleType.required': 'Vehicle type is required',
  'investmentAmount.required': 'Investment amount is required',
  'percentageShare.required': 'Percentage share is required',
}

const CreateInvestorVehicleRequestValidator = vine.compile(createInvestorVehicleRequestSchema)

CreateInvestorVehicleRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CreateInvestorVehicleRequestValidator
