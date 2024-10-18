/* eslint-disable multiline-ternary */
// ** React Imports
// ** Custom Components
import Avatar from '@components/avatar'
// ** Utils
import { formatDateToMonthShort, isObjEmpty } from '@utils'
// ** Third Party Components
import classnames from 'classnames'
import { useEffect, useReducer, useState } from 'react'
import { Search, X } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useDispatch } from 'react-redux'
import { ReadyState } from 'react-use-websocket'
// ** Reactstrap Imports
import { Badge, CardText, Input, InputGroup, InputGroupText } from 'reactstrap'
import { useRedux } from '../../redux/useRedux'
import { CMD } from '../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../utility/helpers/common'
import Hide from '../../utility/Hide'
import useWebSockets from '../../utility/hooks/useSocket'
import useUser from '../../utility/hooks/useUser'
import Show from '../../utility/Show'
import { decrypt, formatDate, minusDay } from '../../utility/Utils'
import Shimmer from '../components/shimmers/Shimmer'
// ** Store & Actions
import { selectChat, toggleRefreshContacts, updateChat, updateContact } from './store'

const SidebarLeft = (props) => {
  // ** Props & Store
  const { store, location, sidebar, handleSidebar, userSidebarLeft, handleUserSidebarLeft } = props
  const { chats, contacts, loading, selectedUser, connectedUsers, perPage } = store
  const userProfile = useUser()

  // ** Dispatch
  const dispatch = useDispatch()

  // ** State
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)
  const [filteredChat, setFilteredChat] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])

  const { sendMessage, readyState, lastMessage } = useWebSockets()

  const today = formatDate(new Date(), 'YYYY-MM-DD')

  // ** Handles User Chat Click
  const handleUserClick = (id) => {
    // dispatch(resetSelected({}))
    dispatch(updateChat(id))
    dispatch(updateContact(id))
    if (isValid(userProfile?.id)) {
      // dispatch(toggleRefreshContacts())
      // dispatch(selectChat({ id, from_date: state.from_date, end_date: state.end_date }))
      sendMessage({
        command: CMD.readMessages,
        other_user_id: id?.id,
        logged_in_user_id: userProfile?.id
      })
      sendMessage({
        command: CMD.getMessages,
        other_user_id: id?.id,
        logged_in_user_id: userProfile?.id,
        per_page: perPage,
        page: 1,
        from_date: null,
        end_date: null
      })
    }
    setActive(id)

    if (sidebar === true) {
      handleSidebar()
    }
  }

  useEffect(() => {
    if (!isObjEmpty(store.selectedUser)) {
      if (store.selectedUser.chat) {
        setActive(store.selectedUser.chat)
      } else {
        setActive(store.selectedUser.contact)
      }
    }
  }, [])

  useEffect(() => {
    if (isValid(location?.user)) {
      handleUserClick(location?.user)
    }
  }, [location, userProfile])

  const getMessages = (lastMessage) => {
    if (lastMessage?.command === CMD.getMessages) {
      if (active?.id !== selectedUser?.contact?.id && lastMessage?.userId === active?.id) {
        dispatch(selectChat({ data: lastMessage, user: active }))
      } else {
        // pagination
        if (
          active?.id === selectedUser?.contact?.id &&
          lastMessage?.page !== selectedUser?.chat?.current_page
        ) {
          log('update')
          dispatch(selectChat({ data: lastMessage, user: active, update: true }))
        }
      }
    }
  }

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      getMessages(lastMessage)
    }
  }, [lastMessage, readyState, selectedUser])

  // ** Renders Chat
  const renderChats = () => {
    if (chats && chats.length) {
      if (query.length && !filteredChat.length) {
        return (
          <li className='no-results show'>
            <h6 className='mb-0'>{FM('no-chats-found')}</h6>
          </li>
        )
      } else {
        let arrToMap = query.length && filteredChat.length ? filteredChat : chats
        arrToMap = arrToMap.filter(
          (value, index, self) => index === self.findIndex((t) => t.id === value.id)
        )
        return arrToMap.map((item) => {
          const time = formatDateToMonthShort(
            item?.chat?.lastMessage ? item?.chat?.lastMessage?.time : new Date()
          )
          // log(`xxxx ${item?.id}`, chats?.findIndex(a => a.id === item?.id))
          // if (chats?.findIndex(a => a.id === item?.id) === -1) {
          return (
            <li
              key={item.id}
              onClick={() => handleUserClick(item)}
              className={classnames({
                active: active?.id === item.id
              })}
            >
              <Avatar
                img={item.avatar}
                status={connectedUsers?.includes(item?.id) ? 'online' : 'offline'}
                imgHeight='42'
                imgWidth='42'
              />
              <div className='chat-info flex-grow-1'>
                <h5 className='mb-0'>{decrypt(item.fullName)}</h5>
                <CardText className='text-truncate'>
                  {item.chat.lastMessage
                    ? item.chat.lastMessage.message
                    : chats[chats.length - 1].message}
                </CardText>
              </div>
              <div className='chat-meta text-nowrap'>
                <small className='float-end mb-25 chat-time ms-25'>{time}</small>
                {item?.chat?.unseenMsgs >= 1 ? (
                  <Badge className='float-end' color='danger' pill>
                    {item?.chat?.unseenMsgs}
                  </Badge>
                ) : null}
              </div>
            </li>
          )
          // }
        })
      }
    } else {
      return null
    }
  }

  // ** Renders Contact
  const renderContacts = () => {
    if (contacts && contacts.length) {
      if (query.length && !filteredContacts.length) {
        return (
          <li className='no-results show'>
            <h6 className='mb-0'>{FM('no-chats-found')}</h6>
          </li>
        )
      } else {
        const arrToMap = query.length && filteredContacts.length ? filteredContacts : contacts
        // log("a", arrToMap)
        return arrToMap.map((item) => {
          const fromChat = chats.findIndex((a) => a.id === item?.id)
          const time = formatDateToMonthShort(
            item?.chat?.lastMessage ? item?.chat?.lastMessage?.time : new Date()
          )
          if (fromChat === -1) {
            return (
              <li
                key={item.fullName}
                onClick={() => handleUserClick(item)}
                className={classnames({
                  active: active?.id === item.id
                })}
              >
                <Avatar
                  img={item.avatar}
                  imgHeight='42'
                  imgWidth='42'
                  status={connectedUsers?.includes(item?.id) ? 'online' : 'offline'}
                />
                <div className='chat-info flex-grow-1'>
                  <h5 className='mb-0'>{decrypt(item.fullName)}</h5>
                  <CardText className='text-truncate'>{item.role}</CardText>
                </div>
                {item?.chat?.unseenMsgs >= 1 ? (
                  <div className='chat-meta text-nowrap'>
                    <small className='float-end mb-25 chat-time ms-25'>{time}</small>
                    <Badge className='float-end' color='danger' pill>
                      {item?.chat?.unseenMsgs}
                    </Badge>
                  </div>
                ) : null}
              </li>
            )
          }
        })
      }
    } else {
      return null
    }
  }

  // ** Handles Filter
  const handleFilter = (e) => {
    setQuery(e.target.value)
    const searchFilterFunction = (contact) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      String(decrypt(contact.fullName)).toLowerCase().includes(e.target.value.toLowerCase())
    const filteredChatsArr = chats.filter(searchFilterFunction)
    const filteredContactssArr = contacts.filter(searchFilterFunction)
    setFilteredChat([...filteredChatsArr])
    setFilteredContacts([...filteredContactssArr])
  }

  return store ? (
    <div className='sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('sidebar-content', {
            show: sidebar === true
          })}
        >
          <div className='sidebar-close-icon' onClick={handleSidebar}>
            <X size={14} />
          </div>
          <div className='chat-fixed-search'>
            <div className='d-flex align-items-center w-100'>
              <div className='sidebar-profile-toggle' onClick={handleUserSidebarLeft}>
                {Object.keys(userProfile ?? {}).length ? (
                  <Avatar
                    className='avatar-border'
                    img={userProfile.avatar}
                    imgHeight='42'
                    imgWidth='42'
                  />
                ) : null}
              </div>
              <InputGroup className='input-group-merge ms-1 w-100'>
                <InputGroupText className='round'>
                  <Search className='text-muted' size={14} />
                </InputGroupText>
                <Input
                  value={query}
                  className='round'
                  placeholder={FM('search-or-start-a-new-chat')}
                  onChange={handleFilter}
                />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar
            className='chat-user-list-wrapper list-group'
            options={{ wheelPropagation: false }}
          >
            <h4 className='chat-list-title'>{FM('chats')}</h4>
            <ul className='chat-users-list chat-list media-list' key={`chats-${query}`}>
              <Show IF={loading && !chats.length}>
                <Shimmer
                  style={{
                    width: '100%',
                    height: 65,
                    marginBottom: 2
                  }}
                />
                <Shimmer
                  style={{
                    width: '100%',
                    height: 65,
                    marginBottom: 2
                  }}
                />
              </Show>
              <Hide IF={loading && !chats.length}>{renderChats()}</Hide>
            </ul>
            <h4 className='chat-list-title'>{FM('contacts')}</h4>
            <ul className='chat-users-list contact-list media-list' key={`contact-${query}`}>
              <Show IF={loading && !contacts.length}>
                <Shimmer
                  style={{
                    width: '100%',
                    height: 65,
                    marginBottom: 2
                  }}
                />
                <Shimmer
                  style={{
                    width: '100%',
                    height: 65,
                    marginBottom: 2
                  }}
                />
                <Shimmer
                  style={{
                    width: '100%',
                    height: 65,
                    marginBottom: 2
                  }}
                />
                <Shimmer
                  style={{
                    width: '100%',
                    height: 65,
                    marginBottom: 2
                  }}
                />
              </Show>
              <Hide IF={loading && !contacts.length}>{renderContacts()}</Hide>
            </ul>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  ) : null
}

export default SidebarLeft
