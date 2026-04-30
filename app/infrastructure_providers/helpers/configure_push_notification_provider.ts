import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import type PushNotificationInterface from '#infrastructure_providers/type_checkings/push_notification/push_notification_interface'
import PushNotificationFactory from '#infrastructure_providers/factories/push_notification_factory'
import pushNotificationConfig from '#config/push_notification_config'

export default function configurePushNotificationProvider() {
  const currentNotificationProvider = pushNotificationConfig.currentProvider

  const pushNotificationProvider = new PushNotificationFactory(currentNotificationProvider).build()

  if (pushNotificationProvider === SERVICE_PROVIDER_NOT_PROFILED) {
    throw new Error(SERVICE_PROVIDER_NOT_PROFILED)
  }

  return pushNotificationProvider as PushNotificationInterface
}
