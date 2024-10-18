// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: {
      data: []
    },
    latestNotification: {
      data: []
    },
    unreadNotification: 0
  },
  reducers: {
    notificationLoad: (state, action) => {
      state.notifications = action?.payload
    },
    latestNotificationLoad: (state, action) => {
      state.latestNotification = action?.payload
    },
    notificationSave: (state, action) => {
      state.notifications.data = [...action?.payload, ...state?.notifications?.data]
    },
    notificationDelete: (state, action) => {
      const index = state.notifications.data.findIndex((x) => x.id === action.payload)
      state.notifications.data.splice(index, 1)
    },
    notificationUpdate: (state, action) => {
      const index = state.notifications.data.findIndex((x) => x.id === action.payload.id)
      state.notifications.data[index] = {
        ...state.notifications.data[index],
        ...action.payload
      }
    },
    notificationUpdateLatest: (state, action) => {
      const index = state.latestNotification.data.findIndex((x) => x.id === action.payload.id)
      state.latestNotification.data[index] = {
        ...state.latestNotification.data[index],
        ...action.payload
      }
    },
    increaseUnreadNotification: (state, action) => {
      state.unreadNotification++
    },
    decreaseUnreadNotification: (state, action) => {
      state.unreadNotification--
    },
    setUnreadNotification: (state, action) => {
      state.unreadNotification = action?.payload
    }
  }
})

export const {
  setUnreadNotification,
  decreaseUnreadNotification,
  increaseUnreadNotification,
  notificationDelete,
  notificationLoad,
  notificationSave,
  notificationUpdateLatest,
  notificationUpdate,
  latestNotificationLoad
} = notificationSlice.actions

export default notificationSlice.reducer
