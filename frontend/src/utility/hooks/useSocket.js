import { useCallback, useContext } from 'react'
import { Socket } from '../context/Socket'
import { JsonParseValidate } from '../Utils'
import useUser from './useUser'

const useWebSockets = () => {
  const user = useUser()
  const token = JSON.parse(localStorage.getItem('access_token'))
  // const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl)
  const { sendJsonMessage, lastMessage, readyState } = useContext(Socket)

  const sendMessageToUser = useCallback(
    ({ to = null, message = '', file_path = null, file_type = null }) =>
      sendJsonMessage({
        command: 'message',
        token,
        to,
        from: user?.id,
        message,
        file_path,
        file_type
      }),
    [user]
  )

  const sendMessage = useCallback(
    (params) =>
      sendJsonMessage({
        ...params,
        token
      }),
    [user]
  )

  return {
    readyState,
    lastMessage: JsonParseValidate(lastMessage?.data),
    sendMessage,
    sendMessageToUser
  }
}

export default useWebSockets
