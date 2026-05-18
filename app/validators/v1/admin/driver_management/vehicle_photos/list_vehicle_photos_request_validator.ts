import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const listVehiclePhotosRequestSchema = vine.object({
  page: vine.number().min(1).optional(),
  limit: vine.number().max(100).optional(),
})

const messages = {}

const ListVehiclePhotosRequestValidator = vine.compile(listVehiclePhotosRequestSchema)

ListVehiclePhotosRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default ListVehiclePhotosRequestValidator
