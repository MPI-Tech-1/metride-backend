import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import FirebasePushNotificationProvider from '#infrastructure_providers/externals/push_notification/firebase_push_notification_provider'

export default class PushNotificationFactory {
  private currentProvider: string

  constructor(currentProvider: string) {
    this.currentProvider = currentProvider
  }

  public build(): FirebasePushNotificationProvider | string {
    if (this.currentProvider === 'firebase') {
      return new FirebasePushNotificationProvider()
    }
    return SERVICE_PROVIDER_NOT_PROFILED
  }
}
