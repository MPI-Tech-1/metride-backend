import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const listOnlineRewardsRequestSchema = vine.object({
  page: vine.number().min(1).optional(),
  limit: vine.number().min(1).max(100).optional(),
})

const ListOnlineRewardsRequestValidator = vine.compile(listOnlineRewardsRequestSchema)

ListOnlineRewardsRequestValidator.messagesProvider = new SimpleMessagesProvider({})

export default ListOnlineRewardsRequestValidator
