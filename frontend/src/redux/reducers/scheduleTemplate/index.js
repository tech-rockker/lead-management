// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const scheduleTemplateSlice = createSlice({
  name: 'scheduleTemplate',
  initialState: {
    scheduleTemplate: {
      data: []
    }
  },
  reducers: {
    scheduleTempLoad: (state, action) => {
      state.scheduleTemplate = action?.payload
    },
    scheduleTempUpdate: (state, action) => {
      const index = state.scheduleTemplate.data.findIndex((x) => x.id === action.payload.id)
      state.scheduleTemplate.data[index] = action.payload
    },
    scheduleTempSave: (state, action) => {
      state.scheduleTemplate.data = [...[action?.payload], ...state?.scheduleTemplate?.data]
    },
    scheduleTempCopy: (state, action) => {
      state.scheduleTemplate.data = [...action?.payload, ...state?.scheduleTemplate?.data]
    },
    scheduleTempChangeStatus: (state, action) => {
      // log(action)
      state.scheduleTemplate.data = [...[action?.payload], ...state?.scheduleTemplate?.data]
    },
    scheduleTempDelete: (state, action) => {
      log(action)
      const index = state.scheduleTemplate.data.findIndex((x) => x.id === action.payload)
      state.scheduleTemplate.data.splice(index, 1)
    }
  }
})

export const {
  scheduleTempDelete,
  scheduleTempLoad,
  scheduleTempSave,
  scheduleTempUpdate,
  scheduleTempCopy,
  scheduleTempChangeStatus
} = scheduleTemplateSlice.actions

export default scheduleTemplateSlice.reducer
