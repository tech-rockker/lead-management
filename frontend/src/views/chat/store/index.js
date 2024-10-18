// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { isValidArray } from '../../../utility/helpers/common'
import {
  changeConnectedUsersResponse,
  changeUserResponse,
  getChatResponse
} from '../../../utility/Utils'

export const getUserProfile = createAsyncThunk('appChat/getTasks', async () => {
  const response = await axios.get('/apps/chat/users/profile-user')
  return response.data
})

// export const selectChat = createAsyncThunk('appChat/selectChat', async ({ id, from_date, end_date }, { dispatch }) => {
//     // const response = await axios.get('/apps/chat/get-chat', { id: id?.id })
//     // await dispatch(getChatContacts())
//     // return response.data
//     const response = await getUserMessages({ async: true, jsonData: { user_id: id?.id, from_date, end_date } })
//     // await dispatch(getChatContacts())
//     return getChatResponse(id, response?.data?.payload)
// })

export const sendMsg = createAsyncThunk('appChat/sendMsg', async (obj, { dispatch }) => {
  // const response = await axios.post('/apps/chat/send-msg', { obj })
  // await dispatch(selectChat(obj.contact.id))
  // await dispatch(getChatContacts())
  return null
})

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    perPage: 20,
    totalUnreadMessages: 0,
    connectedUsers: [],
    loading: false,
    refreshContacts: false,
    chats: [],
    contacts: [],
    userProfile: {},
    selectedUser: {
      chat: {
        chat: []
      },
      contact: {}
    }
  },
  reducers: {
    toggleRefreshContacts: (state, action) => {
      // log("action", action)
      state.refreshContacts = action?.payload
    },
    setConnected: (state, action) => {
      // log("action", action)
      state.connectedUsers = changeConnectedUsersResponse(action.payload)
    },
    setContacts: (state, action) => {
      // log("action", action)
      const chats = changeUserResponse(
        [],
        action.payload?.users,
        action?.payload?.user,
        action?.payload?.add
      )
      state.contacts = chats.contacts
      if (isValidArray(chats.chatsContacts)) {
        state.chats.shift(chats.chatsContacts)
      }
    },
    setChats: (state, action) => {
      // log("action", action)
      const chats = changeUserResponse(
        action.payload?.users,
        [],
        action?.payload?.user,
        action?.payload?.add
      )
      state.chats = chats.chatsContacts
      state.totalUnreadMessages = chats.unread_messages_count
    },
    selectChat: (state, action) => {
      // log("action", action)
      state.selectedUser = getChatResponse(action?.payload, state?.selectedUser?.chat?.chat)
      state.totalUnreadMessages = 0
    },
    updateContact: (state, action) => {
      const index = state.contacts.findIndex((x) => x.id === action.payload.id)
      if (index > -1) {
        state.contacts[index] = {
          ...state.contacts[index],
          chat: {
            ...state.contacts[index]?.chat,
            unseenMsgs:
              action?.payload?.type === 'i' ? state.contacts[index]?.chat?.unseenMsgs + 1 : 0
          }
        }
        // state.totalUnreadMessages +=
        //   action?.payload?.type === 'i' ? state.contacts[index]?.chat?.unseenMsgs + 1 : 0
      }
    },
    updateChat: (state, action) => {
      const index = state.chats.findIndex((x) => x.id === action.payload.id)
      if (index > -1) {
        state.chats[index] = {
          ...state.chats[index],
          chat: {
            ...state.chats[index]?.chat,
            unseenMsgs: action?.payload?.type === 'i' ? state.chats[index]?.chat?.unseenMsgs + 1 : 0
          }
        }
        // state.totalUnreadMessages +=
        //   action?.payload?.type === 'i' ? state.chats[index]?.chat?.unseenMsgs + 1 : 0
      }
    },
    sendMessageSelected: (state, action) => {
      state.selectedUser.chat.chat.push(action?.payload)
    },
    updateMessageSelected: (state, action) => {
      const index = state.selectedUser.chat.chat.findIndex((x) => x.id === action.payload.id)
      if (index > -1) {
        state.selectedUser.chat.chat[index] = action?.payload
      }
    },
    deleteMessageSelected: (state, action) => {
      const index = state.selectedUser.chat.chat.findIndex((x) => x.id === action.payload.id)
      if (index > -1) {
        state.selectedUser.chat.chat.splice(index, 1)
      }
    },
    receiveMessageSelected: (state, action) => {
      state.selectedUser.chat.chat.push(action?.payload)
    },
    setTotalUnreadMessages: (state, action) => {
      state.totalUnreadMessages = action?.payload
    }
  }
})

export const {
  sendMessageSelected,
  receiveMessageSelected,
  updateMessageSelected,
  deleteMessageSelected,
  setContacts,
  setChats,
  selectChat,
  updateContact,
  updateChat,
  setConnected,
  toggleRefreshContacts,
  setTotalUnreadMessages
} = appChatSlice.actions

export default appChatSlice.reducer
