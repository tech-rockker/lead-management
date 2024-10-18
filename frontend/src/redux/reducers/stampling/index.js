// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const stamplingSlice = createSlice({
  name: 'stampling',
  initialState: {
    stampling: {
      data: []
    },
    stampView: null
  },
  reducers: {
    stamplingLoad: (state, action) => {
      state.stampling = action?.payload
    },
    stamplingView: (state, action) => {
      state.stampView = action?.payload
    },
    stamplingGet: (state, action) => {
      state.stampView = action?.payload
    },
    stamplingUpdate: (state, action) => {
      const index = state.stampling.data.findIndex((x) => x.id === action.payload.id)
      state.stampling.data[index] = action.payload
    },
    stamplingSave: (state, action) => {
      state.stampling.data = [...action?.payload, ...state?.stampling?.data]
    },
    stamplingDelete: (state, action) => {
      log(action)
      const index = state.stampling.data.findIndex((x) => x.id === action.payload)
      state.stampling.data.splice(index, 1)
    }
  }
})

export const {
  stamplingLoad,
  stamplingUpdate,
  stamplingSave,
  stamplingDelete,
  stamplingView,
  stamplingGet
} = stamplingSlice.actions

export default stamplingSlice.reducer
