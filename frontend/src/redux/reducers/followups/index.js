// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const followupSlice = createSlice({
  name: 'followup',
  initialState: {
    followup: {
      data: [],
      not_completed_follow_ups: 0,
      completed_follow_ups: 0
    }
  },
  reducers: {
    followupLoad: (state, action) => {
      state.followup = action?.payload
    },
    followupEditHistory: (state, action) => {
      state.followup = action?.payload
    },
    activityEditHistory: (state, action) => {
      state.followup = action?.payload
    },
    followupView: (state, action) => {
      const index = state.followup.data.findIndex((x) => x.id === action.payload.id)
      state.followup.data[index] = action.payload
    },
    followupUpdate: (state, action) => {
      const index = state.followup.data.findIndex((x) => x.id === action.payload.id)
      state.followup.data[index] = action.payload
    },
    folloupSave: (state, action) => {
      state.followup.data = [...action?.payload, ...state?.followup?.data]
    },
    followupComplete: (state, action) => {
      // state.followup.data = [
      //     ...action?.payload,
      //     ...state?.followup?.data
      // ]
      const index = state.followup.data.findIndex((x) => x.id === action.payload.id)
      // state.followup.data[index] = {
      //     ...state.followup.data[index],
      //     ...action.payload,
      //     is_completed: parseInt(action?.payload?.is_completed)
      // }
      state.followup.data[index] = action.payload
      state.followup.data.splice(index, 1)
      if (action?.payload?.is_completed === 1) {
        state.followup.completed_follow_ups++
      }
    },
    followupDelete: (state, action) => {
      log(action)
      const index = state.followup.data.findIndex((x) => x.id === action.payload)
      state.followup.data.splice(index, 1)
    }
  }
})

export const {
  followupDelete,
  followupLoad,
  followupComplete,
  followupEditHistory,
  activityEditHistory,
  folloupSave,
  followupUpdate,
  followupView
} = followupSlice.actions

export default followupSlice.reducer
