// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    leave: {
      data: []
    }
  },

  reducers: {
    leaveLoad: (state, action) => {
      state.leave = action?.payload
    },
    leaveSave: (state, action) => {
      log(action)
      state.leave.data = [...action?.payload, ...state?.leave?.data]
    },
    leaveView: (state, action) => {
      const index = state.leave.data.findIndex((x) => x.id === action.payload.id)
      state.leave.data[index] = action.payload
    },
    leaveUpdate: (state, action) => {
      const index = state.leave.data.findIndex((x) => x.id === action.payload.id)
      state.leave.data[index] = {
        ...state.leave.data[index],
        ...action.payload
      }
    },
    leaveDelete: (state, action) => {
      const index = state.leave.data.findIndex((x) => x.id === action.payload)
      state.leave.data.splice(index, 1)
    },
    leaveApproveWithoutStap: (state, action) => {
      const index = state.leave.data.findIndex((x) => x.group_id === action.payload?.group_id)
      state.leave.data[index] = {
        ...state.leave.data[index],
        ...action.payload
      }
    },
    leaveApproved: (state, action) => {
      const index = state.leave.data.findIndex((x) => x.id === action.payload[0]?.id)
      state.leave.data[index] = {
        ...state.leave.data[index],
        ...action.payload[0]
      }
    },
    leaveScheduleSlotRedux: (state, action) => {
      const index = state.leave.data.findIndex((x) => x.id === action.payload.id)
      state.leave.data[index] = {
        ...state.leave.data[index],
        ...action.payload
      }
    },
    leaveCompany: (state, action) => {
      const index = state.leave.data.findIndex((x) => x.id === action.payload[0]?.id)
      state.leave.data[index] = {
        ...state.leave.data[index],
        ...action.payload[0]
      }
    }
  }
})

export const {
  leaveDelete,
  leaveUpdate,
  leaveView,
  leaveSave,
  leaveLoad,
  leaveApproved,
  leaveApproveWithoutStap,
  leaveScheduleSlotRedux,
  leaveCompany
} = leaveSlice.actions

export default leaveSlice.reducer
