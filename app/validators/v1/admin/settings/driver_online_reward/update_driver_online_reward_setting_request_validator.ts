import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const TIME_OF_DAY = /^([01]\d|2[0-3]):[0-5]\d$/

const updateDriverOnlineRewardSettingRequestSchema = vine.object({
  isEnabled: vine.boolean(),
  windowStartTime: vine.string().trim().regex(TIME_OF_DAY),
  windowEndTime: vine.string().trim().regex(TIME_OF_DAY),
  rewardAmount: vine.number().withoutDecimals().min(0),
  graceMinutes: vine.number().withoutDecimals().min(0).max(60),
  acceptanceTimeoutMinutes: vine.number().withoutDecimals().min(1).max(60),
})

const messages = {
  'isEnabled.required': 'Please state whether the reward is enabled.',
  'isEnabled.boolean': 'isEnabled must be true or false.',
  'windowStartTime.required': 'Please provide the window start time.',
  'windowStartTime.regex': 'Window start time must be in 24-hour HH:mm format, e.g. 07:00.',
  'windowEndTime.required': 'Please provide the window end time.',
  'windowEndTime.regex': 'Window end time must be in 24-hour HH:mm format, e.g. 09:00.',
  'rewardAmount.required': 'Please provide the reward amount in kobo.',
  'rewardAmount.number': 'Reward amount must be a number (kobo).',
  'rewardAmount.withoutDecimals': 'Reward amount must be a whole number of kobo.',
  'rewardAmount.min': 'Reward amount cannot be negative.',
  'graceMinutes.required': 'Please provide the grace period in minutes.',
  'graceMinutes.withoutDecimals': 'Grace minutes must be a whole number.',
  'graceMinutes.min': 'Grace minutes cannot be negative.',
  'graceMinutes.max': 'Grace minutes cannot exceed 60.',
  'acceptanceTimeoutMinutes.required': 'Please provide the acceptance timeout in minutes.',
  'acceptanceTimeoutMinutes.withoutDecimals': 'Acceptance timeout must be a whole number.',
  'acceptanceTimeoutMinutes.min': 'Acceptance timeout must be at least 1 minute.',
  'acceptanceTimeoutMinutes.max': 'Acceptance timeout cannot exceed 60 minutes.',
}

const UpdateDriverOnlineRewardSettingRequestValidator = vine.compile(
  updateDriverOnlineRewardSettingRequestSchema
)

UpdateDriverOnlineRewardSettingRequestValidator.messagesProvider = new SimpleMessagesProvider(
  messages
)

export default UpdateDriverOnlineRewardSettingRequestValidator
