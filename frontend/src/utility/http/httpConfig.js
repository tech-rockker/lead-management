// ** Api Endpoints
const domain = "127.0.0.1:8000"
// const domain = "192.168.1.4"
// const domain = 'api.aceuss.se'
// const domain = 'staging-api.aceuss.se'
// const domain = 'staging.api.aceuss.se'
// const ip = '86.106.25.14'
// const domain = "testing.3mad.in"
// const domain = "ok-go.in"
export default {
  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'access_token',
  storageRefreshTokenKeyName: 'access_token',

  // base api urls
  baseUrl: `http://${domain}/api/v1/`,
  socketChatUrl: `wss://${domain}/wss2/:8090`,
  socketNotificationUrl: domain,
  socketNotificationPort: 6001,
  PUSHER_APP_ID: '1399751877',
  PUSHER_APP_KEY: 'b3c8fc875e4efec7dZ1e',
  PUSHER_APP_SECRET: '1a982de8babb18dccZ1e',
  PUSHER_APP_CLUSTER: 'mt1',

  imgUrl: `http://${domain}/uploads/`,

  imgUrl: `http://${domain}/uploads/`,
  exportUrl: `http://${domain}/export/`,

  enableSocket: true,
  stampEnabled: false,
  encryptKey: `C&E)H@McQfTjWnZr4u7x!A%D*G-JaNdR`,
  enableAES: true
}
