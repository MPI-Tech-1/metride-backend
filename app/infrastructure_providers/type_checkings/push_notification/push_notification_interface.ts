import type PushNotificationMessageType from '#infrastructure_providers/type_checkings/push_notification/push_notification_message_type'

interface PushNotificationInterface {
  send(pushNotificationMessage: PushNotificationMessageType): Promise<void>
}

export default PushNotificationInterface
