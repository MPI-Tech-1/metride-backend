import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import type PushNotificationInterface from '#infrastructure_providers/type_checkings/push_notification/push_notification_interface'
import type PushNotificationMessageType from '#infrastructure_providers/type_checkings/push_notification/push_notification_message_type'
import pushNotificationConfig from '#config/push_notification_config'
import convertBase64ToString from '#common/helper_functions/convert_base64_to_string'

export default class FirebasePushNotificationProvider implements PushNotificationInterface {
  constructor() {
    const { firebase } = pushNotificationConfig

    if (getApps().length === 0) {
      const serviceAccount = convertBase64ToString(firebase.serviceAccount)
      initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
      })
    }
  }

  public async send(pushNotificationMessage: PushNotificationMessageType): Promise<void> {
    try {
      await getMessaging().send(pushNotificationMessage)
    } catch (processSendNotificationError) {
      console.log(
        `FirebaseMessageProvider.processSendNotificationError =>`,
        processSendNotificationError
      )
    }
  }
}
