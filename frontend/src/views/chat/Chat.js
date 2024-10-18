/* eslint-disable multiline-ternary */
// ** React Imports
// ** Custom Components
import Avatar from '@components/avatar'
// ** Third Party Components
import classnames from 'classnames'
import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Check, File, Image, Menu, MessageSquare, Send, Smile } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'

// ** Reactstrap Imports
import { Button, Form, Input, InputGroup, InputGroupText, Label, Spinner } from 'reactstrap'
import { ReactComponent as CheckLogo } from '../../assets/images/backgrounds/check-double.svg'
import { useRedux } from '../../redux/useRedux'
import { uploadFiles } from '../../utility/apis/commons'
import { FM, isValid, isValidArray, log } from '../../utility/helpers/common'
import useWebSockets from '../../utility/hooks/useSocket'
import Show from '../../utility/Show'
import {
  ErrorToast,
  decrypt,
  fastLoop,
  fetchMessage,
  formatDate,
  getUniqId,
  minusDay
} from '../../utility/Utils'
import BsTooltip from '../components/tooltip'
import {
  deleteMessageSelected,
  sendMessageSelected,
  toggleRefreshContacts,
  updateMessageSelected
} from './store'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { ThemeColors } from '../../utility/context/ThemeColors'
import Hide from '../../utility/Hide'
import 'react-medium-image-zoom/dist/styles.css'
import { CMD } from '../../utility/Const'

const ChatLog = (props) => {
  // ** Props & Store
  const { handleUser, handleUserSidebarRight, handleSidebar, store, userSidebarLeft } = props
  const { selectedUser, connectedUsers, perPage } = store
  const {
    reduxStates: {
      auth: { userData: userProfile },
      chat: { chats, refreshContacts }
    },
    dispatch
  } = useRedux()
  // ** Refs & Dispatch
  const chatArea = useRef(null)
  const [controller, setController] = useState(new AbortController())
  const [progress, setProgress] = useState(null)
  const [files, setFiles] = useState(null)
  const { sendMessage, readyState, lastMessage, ReadyState, sendMessageToUser } = useWebSockets()
  const [mimeTypeMN, setMimetypeMN] = useState(null)
  const colors = useContext(ThemeColors)
  const [isZoomed, setIsZoomed] = useState(false)
  const [scroll, setScroll] = useState(true)
  // ** State
  const [msg, setMsg] = useState('')
  const today = formatDate(new Date(), 'YYYY-MM-DD')

  // ** Scroll to chat bottom
  const scrollToBottom = (val = null) => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    if (chatContainer) {
      chatContainer.scrollTop = val ?? chatContainer.scrollHeight
    }
  }

  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUser).length

    if (selectedUserLen && scroll) {
      scrollToBottom()
    }
  }, [selectedUser])

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog = []
    if (selectedUser.chat) {
      chatLog = selectedUser.chat.chat
    }

    const formattedChatLog = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined
    let msgGroup = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          id: msg?.id,
          msg: msg.message,
          file_path: msg?.file_path,
          file_type: msg?.file_type,
          time: msg.time,
          progress: msg?.progress,
          read_at: msg.read_at,
          ...msg
        })
        msgGroup.created_at = msg?.created_at
      } else {
        chatMessageSenderId = msg.senderId
        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          created_at: msg.created_at,
          messages: [
            {
              id: msg?.id,
              msg: msg.message,
              time: msg.time,
              file_path: msg?.file_path,
              file_type: msg?.file_type,
              progress: msg?.progress,
              read_at: msg.read_at,
              ...msg
            }
          ]
        }
      }
      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })
    return formattedChatLog
  }
  const handleZoomChange = useCallback((shouldZoom, id) => {
    setIsZoomed(shouldZoom ? id : shouldZoom)
  }, [])

  const renderServerFile = (m) => {
    const imgs = ['jpg', 'png', 'gif', 'jpeg', 'svg']
    const preview = {
      pdf: require('../../assets/images/icons/pdf.png').default,
      mp4: require('../../assets/images/icons/video.png').default,
      unknown: require('../../assets/images/icons/unknown.png').default
    }

    const image = preview[m?.file_type] ?? preview?.unknown
    if (imgs.includes(m?.file_type)) {
      return (
        <ControlledZoom
          overlayBgColorStart={''}
          overlayBgColorEnd={'rgb(7 7 7 / 60%)'}
          isZoomed={isZoomed === m?.id}
          onZoomChange={(e) => handleZoomChange(e, m?.id)}
        >
          <Show IF={isZoomed === m?.id}>
            <img
              src={m?.file_path}
              style={{ width: '100vh', height: 'auto' }}
              className='img-fluid'
            />
          </Show>
          <Hide IF={isZoomed === m?.id}>
            {/* <Image size={100} /> */}
            <img src={m?.file_path} className='img-fluid' />
          </Hide>
        </ControlledZoom>
      )
    } else {
      return (
        <a href={m.file_path} target='_blank'>
          <img src={image} className='img-fluid' />
        </a>
      )
    }
    // else if (m?.file_type === "mp4") {
    //     return <ControlledZoom overlayBgColorStart={""} overlayBgColorEnd={"rgb(7 7 7 / 60%)"} isZoomed={isZoomed === m?.id} onZoomChange={e => handleZoomChange(e, m?.id)}>
    //         <Show IF={isZoomed === m?.id}>
    //             <video style={{ width: "100vh", height: "auto" }} controls>
    //                 <source src={m?.file_path} type="video/mp4" />
    //                 Your browser does not support the video tag.
    //             </video>
    //         </Show>
    //         <Hide IF={isZoomed === m?.id}>
    //             <img src={image} className="img-fluid" />
    //         </Hide>
    //     </ControlledZoom>
    // }
  }

  const renderFile = (message) => {
    if (isValid(files) && isValid(progress)) {
      const file = files[message?.id]
      const p = progress[message?.id] ? parseInt(progress[message?.id]) : 0
      if (isValid(file)) {
        return (
          <>
            <div className='file'>
              <div className={classnames('file-name', { 'border-0 mb-0': p >= 100 })}>
                {file?.name}
              </div>
              <div
                style={{ width: 80, height: 80 }}
                className={classnames('p', { 'd-none': p >= 100 })}
              >
                <CircularProgressbar
                  styles={buildStyles({
                    // Rotation of path and trail, in number of turns (0-1)
                    rotation: 0.25,

                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'butt',

                    // Text size
                    textSize: '14px',

                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 0.5,

                    // Can specify path transition in more detail, or remove it entirely
                    // pathTransition: 'none',

                    // Colors
                    pathColor: '#fff',
                    textColor: '#fff',
                    trailColor: '#5058b8',
                    backgroundColor: '#5058b8'
                  })}
                  value={p}
                  text={p === 100 ? '✔' : `${p}%`}
                />
              </div>
            </div>
          </>
        )
      } else {
        renderServerFile(message)
      }
    }
    return renderServerFile(message)
  }

  // ** Renders user chat
  const renderChats = () => {
    // log(formattedChatData())
    let prevDate = null
    const re = []
    fastLoop(formattedChatData(), (item, index) => {
      log(item?.created_at !== prevDate, prevDate)

      re.push(
        <>
          <Show
            IF={formatDate(item?.created_at, 'YYYY-MM-DD') !== formatDate(prevDate, 'YYYY-MM-DD')}
          >
            <div
              className='shadow white'
              style={{
                padding: 2,
                fontSize: 10,
                width: '100px',
                backgroundColor: 'white',
                margin: 'auto',
                textAlign: 'center',
                borderRadius: 4
              }}
            >
              {formatDate(item?.created_at, 'DD MMMM, YYYY')}
            </div>
          </Show>
          <div
            id={formatDate(item?.created_at, 'DD-MM-YYYY')}
            key={index}
            className={classnames('chat', {
              'chat-left': item?.senderId !== userProfile?.id
            })}
          >
            <div className='chat-avatar'>
              <Avatar
                imgWidth={36}
                imgHeight={36}
                className='box-shadow-1 cursor-pointer'
                img={
                  item?.senderId === userProfile?.id
                    ? userProfile?.avatar
                    : selectedUser?.contact?.avatar
                }
              />
            </div>

            <div className='chat-body pt-1'>
              {item?.messages?.map((chat) => (
                <div
                  key={chat?.msg}
                  className={classnames('chat-content', { 'with-file': isValid(chat?.file_path) })}
                >
                  <Show IF={isValid(chat?.file_path)}>
                    <div className='attachment'>{renderFile(chat)}</div>
                    <div className='d-flex justify-content-between'>
                      <span className='size'>{chat?.file_type}</span>
                      <span className='time'>
                        {formatDate(chat?.time, 'hh:mm A')}
                        <Show IF={isValid(chat?.read_at)}>
                          <CheckLogo />
                        </Show>
                      </span>
                    </div>
                  </Show>
                  <Hide IF={isValid(chat?.file_path)}>
                    <p>{chat?.msg}</p>
                    <span className='time'>
                      {formatDate(chat?.time, 'HH:MM')}
                      <Show IF={isValid(chat?.read_at)}>
                        <CheckLogo />
                      </Show>
                    </span>
                  </Hide>
                </div>
              ))}
            </div>
          </div>
        </>
      )
      prevDate = item?.created_at
    })
    return re
  }

  // ** Opens right sidebar & handles its data
  const handleAvatarClick = (obj) => {
    handleUserSidebarRight()
    handleUser(obj)
  }

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (!selectedUser?.chat?.contact?.id && !userSidebarLeft && window.innerWidth < 992) {
      handleSidebar()
    }
  }

  // ** Sends New Msg
  const handleSendMsg = (e) => {
    e.preventDefault()
    if (msg.length) {
      sendMessageToUser({
        to: selectedUser?.contact?.id,
        message: msg
      })
      scrollToBottom()
      if (chats.length === 0) {
        // dispatch(getChatContacts())
      }
      setMsg('')
    }
  }

  // receive new msg
  useEffect(() => {
    if (isValid(lastMessage) && lastMessage?.command === 'message') {
      // log("lastmessages", lastMessage)
      if (!isValidArray(selectedUser?.chat?.chat)) {
        if (refreshContacts !== lastMessage?.id) {
          log('a')
          dispatch(toggleRefreshContacts(lastMessage?.id))
        }
      }
      fetchMessage(
        userProfile,
        lastMessage,
        dispatch,
        selectedUser?.chat?.chat,
        selectedUser?.contact
      )
    }
  }, [lastMessage, refreshContacts])

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper = selectedUser?.contact?.id ? PerfectScrollbar : 'div'

  useEffect(() => {
    if (isValid(progress)) {
      const allProgress = Object.entries(progress)
      if (isValidArray(allProgress)) {
        for (const [key, val] of allProgress) {
          const f = files
          if (val === 100) {
            delete f[key]
            setFiles({
              ...f
            })
            dispatch(
              deleteMessageSelected({
                id: key
              })
            )
          }
        }
      }
    }
  }, [progress])

  const handleUpload = (files, id) => {
    dispatch(
      sendMessageSelected({
        id,
        message: null,
        time: null,
        senderId: userProfile?.id,
        file_path: 'test',
        file_type: mimeTypeMN,
        progress: 0
      })
    )
    log(files)
    uploadFiles({
      success: (d) => {
        // setProgress(null)
        sendMessageToUser({
          to: selectedUser?.contact?.id,
          message: null,
          file_path: d?.payload?.file_name,
          file_type: d?.payload?.file_extension
        })
        scrollToBottom()
      },
      progress: (e) => setProgress({ ...progress, [id]: e }),
      controller,
      formData: { is_multiple: 0, file: files[0] }
    })
  }

  const handleFile = (e) => {
    log(e?.target?.files)
    if (isValid(e?.target?.files)) {
      if (
        [
          'image/gif',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'application/pdf',
          'audio/aac',
          'text/csv',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'audio/mpeg',
          'video/mp4',
          'video/mpeg',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'image/svg+xml',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]?.includes(e?.target?.files[0]?.type) &&
        e?.target?.files[0]?.size <= 10490000
      ) {
        const id = getUniqId(new Date().getTime())
        handleUpload(e?.target?.files, id)
        setFiles({
          ...files,
          [id]: {
            name: e?.target?.files[0]?.name,
            size: e?.target?.files[0]?.size,
            mime: e?.target?.files[0]?.type
          }
        })
      } else {
        ErrorToast('file-not-supported')
      }
    }
  }
  const handleLoadMore = (e) => {
    if (
      isValidArray(selectedUser?.chat?.chat) &&
      selectedUser?.chat?.last_page !== selectedUser?.chat?.current_page
    ) {
      if (e?.scrollTop <= 500) {
        log('lm', e.scrollTop)
        setScroll(false)
        if (isValid(userProfile?.id)) {
          // dispatch(toggleRefreshContacts())
          // dispatch(selectChat({ id, from_date: state.from_date, end_date: state.end_date }))
          sendMessage({
            command: CMD.readMessages,
            other_user_id: selectedUser?.contact?.id,
            logged_in_user_id: userProfile?.id
          })
          sendMessage({
            command: CMD.getMessages,
            other_user_id: selectedUser?.contact?.id,
            logged_in_user_id: userProfile?.id,
            per_page: perPage,
            page: selectedUser?.chat?.current_page + 1,
            from_date: null,
            end_date: null
          })
          scrollToBottom(500)
        }
      }
    }
  }
  return (
    <div className='chat-app-window'>
      <div
        className={classnames('start-chat-area position-relative', {
          'd-none': selectedUser?.contact?.id
        })}
      >
        <div className='backdrop-chat'></div>
        <div className='start-chat-icon mb-1'>
          <MessageSquare />
        </div>
        <h4 className='sidebar-toggle start-chat-text' onClick={handleStartConversation}>
          {FM('start-conversation')}
        </h4>
      </div>
      {selectedUser?.contact?.id ? (
        <div className={classnames('active-chat', { 'd-none': selectedUser === null })}>
          <div className='backdrop-chat'></div>

          <div className='chat-navbar'>
            <header className='chat-header'>
              <div className='d-flex align-items-center'>
                <div className='sidebar-toggle d-block d-lg-none me-1' onClick={handleSidebar}>
                  <Menu size={21} />
                </div>
                <Avatar
                  alt=''
                  imgHeight='36'
                  imgWidth='36'
                  img={selectedUser.contact.avatar}
                  status={
                    connectedUsers?.includes(selectedUser?.contact?.id) ? 'online' : 'offline'
                  }
                  className='avatar-border user-profile-toggle m-0 me-1'
                  //   onClick={() => handleAvatarClick(selectedUser.contact)}
                />
                <h6 className='mb-0'>
                  {decrypt(selectedUser.contact.fullName)}
                  <p className='text-muted text-small-12 mb-0'>{selectedUser?.contact?.role}</p>
                </h6>
              </div>
              {/* <div className='d-flex d-none align-items-center'>
                                <PhoneCall size={18} className='cursor-pointer d-sm-block d-none me-1' />
                                <Video size={18} className='cursor-pointer d-sm-block d-none me-1' />
                                <Search size={18} className='cursor-pointer d-sm-block d-none' />
                                <UncontrolledDropdown className='more-options-dropdown'>
                                    <DropdownToggle className='btn-icon' color='transparent' size='sm'>
                                        <MoreVertical size='18' />
                                    </DropdownToggle>
                                    <DropdownMenu end>
                                        <DropdownItem href='/' onClick={e => e.preventDefault()}>
                                            View Contact
                                        </DropdownItem>
                                        <DropdownItem href='/' onClick={e => e.preventDefault()}>
                                            Mute Notifications
                                        </DropdownItem>
                                        <DropdownItem href='/' onClick={e => e.preventDefault()}>
                                            Block Contact
                                        </DropdownItem>
                                        <DropdownItem href='/' onClick={e => e.preventDefault()}>
                                            Clear Chat
                                        </DropdownItem>
                                        <DropdownItem href='/' onClick={e => e.preventDefault()}>
                                            Report
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div> */}
            </header>
          </div>

          <ChatWrapper
            ref={chatArea}
            onScrollUp={handleLoadMore}
            // onYReachStart={(e) => {
            //   handleLoadMore()
            // }}
            className='user-chats '
            options={{ wheelPropagation: false, wheelSpeed: 0.2, swipeEasing: true }}
          >
            {selectedUser.chat ? (
              <div className='chats' key={`chats-${selectedUser?.chat?.chat?.length}`}>
                {renderChats()}
              </div>
            ) : null}
          </ChatWrapper>

          <Form className='chat-app-form' onSubmit={(e) => handleSendMsg(e)}>
            <InputGroup className='input-group-merge me-1 form-send-message'>
              <InputGroupText>
                <Smile className='cursor-pointer' size={14} />
              </InputGroupText>
              <Input
                type='text'
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder='Type your message or use speech to text'
              />
              <InputGroupText>
                <Label className='attachment-icon mb-0' for='attach-doc'>
                  <BsTooltip title={FM('attach-file')}>
                    <File className='cursor-pointer text-secondary' size={14} />
                    <input onChange={handleFile} type='file' id='attach-doc' hidden />
                  </BsTooltip>
                </Label>
              </InputGroupText>
            </InputGroup>
            <Button className='send' color='primary'>
              <Send size={14} className='d-lg-none' />
              <span className='d-none d-lg-block'>{FM('send')}</span>
            </Button>
          </Form>
        </div>
      ) : null}
    </div>
  )
}

export default ChatLog
