// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const ovSlice = createSlice({
  name: 'ovhour',
  initialState: {
    ovhour: {
      data: []
    },
    viewOv: null
  },
  reducers: {
    ovLoad: (state, action) => {
      state.ovhour = action?.payload
    },
    ovUpdate: (state, action) => {
      const index = state.ovhour.data.findIndex((x) => x.id === action.payload.id)
      state.ovhour.data[index] = action.payload
    },
    ovView: (state, action) => {
      state.viewOv = action?.payload
    },
    ovSave: (state, action) => {
      state.ovhour.data = [...action?.payload, ...state?.ovhour?.data]
    },
    ovDelete: (state, action) => {
      log(action)
      const index = state.ovhour.data.findIndex((x) => x.id === action.payload)
      state.ovhour.data.splice(index, 1)
    }
  }
})

export const { ovLoad, ovUpdate, ovSave, ovDelete, ovView } = ovSlice.actions

export default ovSlice.reducer
