import env from '#start/env'

export default {
  currentProvider: env.get('CURRENT_BOOKING_UPDATE_LOGGER_PROVIDER'),

  slack: {
    bookingUpdateWebhookUrl: env.get('BOOKING_UPDATE_LOGGER_SLACK_WEBHOOK_URL'),
  },
}
