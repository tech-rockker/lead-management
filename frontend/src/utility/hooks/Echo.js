import Echo from 'laravel-echo'
import { isValid } from '../helpers/common'
import httpConfig from '../http/httpConfig'
window.Pusher = require('pusher-js')

let e

const createConnection = () => {
  if (!isValid(e)) {
    if (isValid(httpConfig.socketNotificationUrl) && httpConfig.enableSocket) {
      e = new Echo({
        broadcaster: 'pusher',
        key: httpConfig.PUSHER_APP_KEY,
        cluster: httpConfig.PUSHER_APP_CLUSTER,
        wsHost: httpConfig.socketNotificationUrl,
        wsPort: httpConfig.socketNotificationPort,
        wssPort: httpConfig.socketNotificationPort,
        disableStats: true,
        forceTLS: false,
        enabledTransports: ['ws']
      })
    }
    return e
  }
}

export const echo = createConnection()

export const echoEvent = (callback = () => {}, user) => {
  echo?.channel(`notifications.${user?.id}-${user?.unique_id}`).listen('.notifications', callback)
}
const notificationPayload = {
  event: 'created',
  module: 'activity',
  notification: {
    resource: {},
    read_status: '',
    status_code: '',
    type: '',
    message: '',
    sub_title: '',
    title: '',
    created_at: ''
  }
}
