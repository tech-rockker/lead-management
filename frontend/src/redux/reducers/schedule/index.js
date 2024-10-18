// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedule: {
      data: []
    }
  },
  reducers: {
    scheduleLoad: (state, action) => {
      state.schedule = action?.payload
    },
    scheduleReports: (state, action) => {
      state.schedule = action?.payload
    },
    scheduleUpdate: (state, action) => {
      const index = state.schedule.data.findIndex((x) => x.id === action.payload.id)
      state.schedule.data[index] = action.payload
    },
    scheduleSave: (state, action) => {
      state.schedule.data = [...action?.payload, ...state?.schedule?.data]
    },
    scheduleDelete: (state, action) => {
      log(action)
      const index = state.schedule.data.findIndex((x) => x.id === action.payload)
      state.schedule.data.splice(index, 1)
    }
  }
})

export const { scheduleDelete, scheduleLoad, scheduleSave, scheduleUpdate, scheduleReports } =
  scheduleSlice.actions

export default scheduleSlice.reducer
