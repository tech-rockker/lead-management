// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const workShiftSlice = createSlice({
  name: 'workShift',
  initialState: {
    workShift: {
      data: []
    }
  },
  reducers: {
    workShiftLoad: (state, action) => {
      state.workShift = action?.payload
    },
    viewAssignShift: (state, action) => {
      state.workShift = action?.payload
    },
    viewWorkShift: (state, action) => {
      const index = state.workShift.data.findIndex((x) => x.id === action.payload.id)
      state.workShift.data[index] = action.payload
    },
    viewEmployeeList: (state, action) => {
      const index = state.workShift.data.findIndex((x) => x.id === action.payload.id)
      state.workShift.data[index] = action.payload
    },
    workShiftUpdate: (state, action) => {
      const index = state.workShift.data.findIndex((x) => x.id === action.payload.id)
      state.workShift.data[index] = action.payload
    },
    workShiftSave: (state, action) => {
      state.workShift.data = [...action?.payload, ...state?.workShift?.data]
    },
    shiftAssignToEmployee: (state, action) => {
      state.workShift.data = [...action?.payload, ...state?.workShift?.data]
    },

    workshiftDelete: (state, action) => {
      log(action)
      const index = state.workShift.data.findIndex((x) => x.id === action.payload)
      state.workShift.data.splice(index, 1)
    }
  }
})

export const {
  workShiftLoad,
  workShiftSave,
  workShiftUpdate,
  workshiftDelete,
  shiftAssignToEmployee,
  viewAssignShift,
  viewEmployeeList,
  viewWorkShift
} = workShiftSlice.actions

export default workShiftSlice.reducer
