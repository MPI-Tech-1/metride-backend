import env from '#start/env'

export default {
  currentProvider: env.get('CURRENT_APPLICATION_LOGGER_PROVIDER'),

  slack: {
    applicationLogWebhookUrl: env.get('APPLICATION_LOGGER_SLACK_WEBHOOK_URL'),
  },
}
