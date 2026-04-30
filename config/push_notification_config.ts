import env from '#start/env'

const pushNotificationConfig = {
  currentProvider: env.get('CURRENT_PUSH_NOTIFICATION_PROVIDER'),
  firebase: {
    identifier: 'firebase',
    serviceAccount: env.get('FIREBASE_PUSH_NOTIFICATION_PROVIDER_SERVICE_ACCOUNT_BASE64'),
  },
}

export default pushNotificationConfig
