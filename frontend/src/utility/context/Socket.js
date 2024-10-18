/* eslint-disable multiline-ternary */
/* eslint-disable implicit-arrow-linebreak */
// ** React Imports
import Avatar from '@components/avatar'
import classNames from 'classnames'
import { createContext, Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { MessageSquare } from 'react-feather'
import { useSelector } from 'react-redux'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { setUnreadNotification } from '../../redux/reducers/notifications'
import { useRedux } from '../../redux/useRedux'
import { getPath } from '../../router/RouteHelper'
import {
  setChats,
  setConnected,
  setContacts,
  setTotalUnreadMessages,
  updateChat,
  updateContact
} from '../../views/chat/store'
import { loadLatestNotifications } from '../apis/notifications'
import { CMD, Events, forDecryption } from '../Const'
import Emitter from '../Emitter'
import { FM, isValid, isValidArray, log } from '../helpers/common'
import { echoEvent } from '../hooks/Echo'
import useTopMostParent from '../hooks/useTopMostParent'
import useUser from '../hooks/useUser'
import httpConfig from '../http/httpConfig'
import {
  changeConnectedUsersResponse,
  decrypt,
  decryptObject,
  GetIcons,
  JsonParseValidate,
  MessageToast,
  truncateText
} from '../Utils'

// ** Create Context
const Socket = createContext({
  sendJsonMessage: () => {},
  lastMessage: null,
  readyState: null
})

document.addEventListener('DOMContentLoaded', function () {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.')
    return
  }

  if (Notification.permission !== 'granted') Notification.requestPermission()
})

const MySwal = withReactContent(Swal)

const popup = (title, text, icon, confirmButtonText) => {
  return MySwal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    allowOutsideClick: false,
    customClass: {
      input: 'form-control mx-3',
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-outline-danger ms-1',
      denyButton: 'btn btn-warning ms-1'
    },
    inputAttributes: {
      autocapitalize: 'off'
    },
    buttonsStyling: false
  })
}

const SocketContext = ({ children }) => {
  const user = useUser()
  const topMostParent = useTopMostParent()
  const token = useSelector((s) => s.auth?.access_token)
  const {
    reduxStates: {
      chat: { contacts, chats, selectedUser, refreshContacts, connectedUsers }
    },
    dispatch
  } = useRedux()
  const [url, setUrl] = useState(null)
  const reconnect = useRef(false)
  const [count, setCount] = useState(0)
  const [registered, setRegistered] = useState(false)

  const loadNotificationList = () => {
    loadLatestNotifications({
      page: 1,
      perPage: 10,
      dispatch,
      success: (data) => {
        dispatch(
          setUnreadNotification(data?.payload?.data?.filter((a) => a.read_status === 0)?.length)
        )
      }
    })
  }

  const { sendJsonMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    url,
    {
      shouldReconnect: (closeEvent) => {
        return reconnect
      },
      reconnectAttempts: 5,
      reconnectInterval: 3000
    },
    httpConfig?.enableSocket
  )

  const registerChat = useCallback(
    () =>
      sendJsonMessage({
        command: 'register',
        userId: user?.id,
        token
      }),
    [user, token]
  )

  const ShowNotification = ({ user, message }) => {
    return (
      <>
        <div
          className='d-flex align-items-center'
          onClick={() => {
            Emitter.emit(Events.RedirectMessage, { user, message })
          }}
        >
          <Fragment>
            <div className='me-1'>
              <Avatar
                color={
                  message?.read_status === 0 ? `light-${message?.status_code}` : 'light-secondary'
                }
                icon={<GetIcons type={message?.type} />}
              />
            </div>
            <div className='list-item-body flex-grow-1'>
              <p className='media-heading mb-0'>
                <span
                  className={classNames('', { 'text-dark fw-bold': message?.read_status === 0 })}
                >
                  {message?.title}
                </span>
              </p>
              <p className='text-secondary text-small-12 mb-0'>{message.message}</p>
            </div>
          </Fragment>
        </div>
      </>
    )
  }
  function osNotification(title, body, image = null, path = null) {
    // log(Notification.permission)
    if (Notification.permission !== 'granted') Notification.requestPermission()
    else {
      const notification = new Notification(title ?? body, {
        icon: image ?? require('../../assets/images/logo/logo.png').default,
        body: title ? body : ''
      })
      notification.onclick = function () {
        window.open(path ?? window.location.href)
      }
    }
  }

  useEffect(() => {
    if (isValid(user)) {
      echoEvent((e) => {
        log('echoEvent', e)
        loadNotificationList()
        if (e?.action === 'required') {
          popup(e?.data?.title, e?.data?.message, 'warning', FM('close'))
        } else if (e?.action === 'IP-approval') {
          Emitter.emit('IP-approval', e)
        } else if (e?.action === 'journal-approval') {
          Emitter.emit('journal-approval', e)
        } else if (e?.action === 'journal-action-approval') {
          Emitter.emit('journal-action-approval', e)
        } else if (e?.action === 'deviation-approval') {
          Emitter.emit('deviation-approval', e)
        } else if (e?.action === 'schedule-company-approval') {
          Emitter.emit('schedule-company-approval', e)
        } else if (e?.action === 'schedule-employee-approval') {
          Emitter.emit('schedule-employee-approval', e)
        } else {
          MessageToast(
            <ShowNotification user={decryptObject(forDecryption, user)} message={e?.data} />,
            { autoClose: false }
          )
        }
        osNotification(e?.data?.title, e?.data?.message)
      }, user)
    }
  }, [user])

  const disconnect = useCallback(() => {
    sendJsonMessage({
      command: 'disconnect',
      userId: user?.id,
      token
    })
    setRegistered(false)
    getWebSocket()?.close()
  }, [user, token])

  useEffect(() => {
    if (isValid(token)) {
      // log(isValid(token))
      setUrl(httpConfig.socketChatUrl)
      if (readyState === ReadyState.CLOSED && count < 5) {
        reconnect.current = true
        setCount(count + 1)
      } else {
        if (count === 5) {
          setRegistered(false)
          getWebSocket()?.close()
        }
      }
    } else {
      setUrl('')
      reconnect.current = false
    }
  }, [token, readyState])

  const sendMessage = useCallback(
    (params) =>
      sendJsonMessage({
        ...params,
        token
      }),
    [token, user]
  )

  const loadContacts = useCallback(
    (from = null) => {
      if (user?.id && topMostParent?.id) {
        sendMessage({
          command: CMD.getContacts,
          top_most_parent_id: topMostParent?.id,
          userId: user?.id,
          executedFrom: from
        })
        sendMessage({
          command: CMD.getChats,
          top_most_parent_id: topMostParent?.id,
          userId: user?.id,
          executedFrom: from
        })
      }
    },
    [user, topMostParent]
  )

  useEffect(() => {
    if (readyState === ReadyState.OPEN && registered) {
      loadContacts('page-load')
    }
  }, [readyState, ReadyState, user, topMostParent, registered])

  const getContacts = (lastMessage) => {
    if (lastMessage?.command === CMD.getContacts) {
      // if (!isValidArray(contacts)) {
      if (isValidArray(lastMessage?.data)) {
        dispatch(setContacts({ user, users: lastMessage.data }))
      }
      // }
    }
  }
  useEffect(() => {
    if (refreshContacts !== false) {
      loadContacts('refresh-contact')
      log('b')
    }
  }, [refreshContacts])

  const getChats = (lastMessage) => {
    if (lastMessage?.command === CMD.getChats) {
      // if (!isValidArray(chats)) {
      const data = Array.isArray(lastMessage.data)
        ? lastMessage.data
        : Object.entries(lastMessage?.data)?.map((r) => r[1])
      if (isValidArray(data)) {
        dispatch(setChats({ users: data, user }))
      }
      // }
    }
  }

  const isValidConnected = (data) => {
    const cu = changeConnectedUsersResponse(data)
    return cu
  }

  const getConnected = (lastMessage) => {
    if (lastMessage?.command === CMD.connectedUsers) {
      // if (!isValidArray(contacts)) {
      if (isValidConnected(lastMessage?.data)) {
        dispatch(setConnected(lastMessage.data))
      }
      // }
    }
  }

  const updateTotalUnreadMessage = (lastMessage) => {
    if (lastMessage?.command === CMD.totalUnreadMessage) {
      if (!isValid(selectedUser?.contact?.id)) {
        dispatch(setTotalUnreadMessages(lastMessage.data))
      }
    }
  }
  const ShowMessage = ({ user, message }) => {
    return (
      <>
        <div
          className='d-flex align-items-center'
          onClick={() => {
            Emitter.emit(Events.RedirectMessage, { user, message })
          }}
        >
          <span className='pe-1'>
            <MessageSquare className='text-primary' size={26} />
          </span>
          <span>
            <p className='text-small-12 mb-3px text-muted'>{decrypt(user?.fullName)}</p>
            <p className='mb-0 text-small-12 text-dark'>{truncateText(message, 100)}</p>
          </span>
        </div>
      </>
    )
  }
  const setRecentMessage = (lastMessage) => {
    if (lastMessage?.command === CMD.message) {
      log(lastMessage)
      // loadContacts()
      const all = chats.concat(contacts)
      const chat = chats?.find((a) => a?.id === lastMessage?.from)
      const contact = contacts?.find((a) => a?.id === lastMessage?.from)
      const userFound = all?.find((a) => a?.id === lastMessage?.from)
      //   if (isValid(selectedUser?.contact?.id)) {
      if (selectedUser?.contact?.id !== lastMessage?.from && lastMessage?.from !== user?.id) {
        if (isValid(contact)) {
          dispatch(updateContact({ ...contact, type: 'i' }))
        }
        if (isValid(chat)) {
          dispatch(updateChat({ ...chat, type: 'i' }))
        }
      }
      //   }
      if (!isValid(selectedUser?.contact?.id) && lastMessage?.from !== user?.id) {
        osNotification(
          decrypt(userFound?.fullName),
          lastMessage?.message,
          userFound?.avatar,
          getPath('messages')
        )
        MessageToast(
          <ShowMessage
            user={decryptObject(forDecryption, userFound)}
            message={lastMessage?.message}
          />
        )
      }
    }
  }
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      getContacts(JsonParseValidate(lastMessage?.data))
      getChats(JsonParseValidate(lastMessage?.data))
      setRecentMessage(JsonParseValidate(lastMessage?.data))
      getConnected(JsonParseValidate(lastMessage?.data))
      updateTotalUnreadMessage(JsonParseValidate(lastMessage?.data))
    }
  }, [lastMessage, readyState])

  // init websocket, register user
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      if (isValid(token)) {
        setRegistered(true)
        registerChat()
      }
    }
  }, [readyState, ReadyState, token])

  return (
    <Socket.Provider value={{ lastMessage, sendJsonMessage, readyState, disconnect }}>
      {children}
    </Socket.Provider>
  )
}

export { Socket, SocketContext }
