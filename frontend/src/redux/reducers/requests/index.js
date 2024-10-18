// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    requests: {
      data: []
    }
  },
  reducers: {
    requestLoad: (state, action) => {
      state.requests = action?.payload
    },
    requestUpdate: (state, action) => {
      const index = state.requests.data.findIndex((x) => x.id === action.payload.id)
      state.requests.data[index] = action.payload
    },

    reqStatus: (state, action) => {
      const index = state.requests.data.findIndex((x) => x.id === action.payload.id)
      state.requests.data[index] = action.payload
    },
    requestSave: (state, action) => {
      state.requests.data = [...action?.payload, ...state?.requests?.data]
    },
    requestDelete: (state, action) => {
      log(action)
      const index = state.requests.data.findIndex((x) => x.id === action.payload)
      state.requests.data.splice(index, 1)
    }
  }
})

export const { requestDelete, requestLoad, requestSave, requestUpdate, reqStatus } =
  requestsSlice.actions

export default requestsSlice.reducer
