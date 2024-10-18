// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

export const logSlice = createSlice({
  name: 'logs',
  initialState: {
    logs: {
      data: []
    }
  },
  reducers: {
    activityLogLoad: (state, action) => {
      state.logs = action?.payload
    },
    activityLogView: (state, action) => {
      const index = state.logs.data.findIndex((x) => x.id === action.payload.id)
      state.logs.data[index] = action.payload
    },
    fileAccessLoad: (state, action) => {
      state.logs = action?.payload
    },
    smsLoad: (state, action) => {
      state.logs = action?.payload
    }
  }
})

export const { activityLogLoad, activityLogView, fileAccessLoad, smsLoad } = logSlice.actions

export default logSlice.reducer
