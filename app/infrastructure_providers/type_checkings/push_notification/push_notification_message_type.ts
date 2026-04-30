type PushNotificationMessageType = {
  notification: {
    title: string
    body: string
  }
  token: string

  data?: any
}

export default PushNotificationMessageType
