import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const listDriverOnlineRewardsRequestSchema = vine.object({
  page: vine.number().min(1).optional(),
  limit: vine.number().min(1).max(100).optional(),
  date: vine
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  driverIdentifier: vine.string().trim().optional(),
})

const messages = {
  'date.regex': 'Date must be in the format YYYY-MM-DD.',
}

const ListDriverOnlineRewardsRequestValidator = vine.compile(listDriverOnlineRewardsRequestSchema)

ListDriverOnlineRewardsRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default ListDriverOnlineRewardsRequestValidator
