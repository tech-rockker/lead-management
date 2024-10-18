// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const departmentSlice = createSlice({
  name: 'department',
  initialState: {
    department: {
      data: []
    }
  },
  reducers: {
    departmentLoad: (state, action) => {
      state.department = action?.payload
    },
    departmentView: (state, action) => {
      const index = state.department.data.findIndex((x) => x.id === action.payload.id)
      state.department.data[index] = action.payload
    },
    departmentUpdate: (state, action) => {
      const index = state.department.data.findIndex((x) => x.id === action.payload.id)
      state.department.data[index] = action.payload
    },
    departmentSave: (state, action) => {
      state.department.data = [...action?.payload, ...state?.department?.data]
    },
    departmentDelete: (state, action) => {
      log(action)
      const index = state.department.data.findIndex((x) => x.id === action.payload)
      state.department.data.splice(index, 1)
    }
  }
})

export const {
  departmentDelete,
  departmentLoad,
  departmentSave,
  departmentUpdate,
  departmentView
} = departmentSlice.actions

export default departmentSlice.reducer
