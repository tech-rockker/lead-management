// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const permissionsSlice = createSlice({
  name: 'permission',
  initialState: {
    permission: {
      data: []
    }
  },
  reducers: {
    permissionLoad: (state, action) => {
      state.permission = action?.payload
    },
    permissionView: (state, action) => {
      const index = state.permission.data.findIndex((x) => x.id === action.payload.id)
      state.permission.data[index] = action.payload
    },
    permissionUpdate: (state, action) => {
      const index = state.permission.data.findIndex((x) => x.id === action.payload.id)
      state.permission.data[index] = action.payload
    },
    permissionSave: (state, action) => {
      state.permission.data = [...action?.payload, ...state?.permission?.data]
    },
    permissionDelete: (state, action) => {
      log(action)
      const index = state.permission.data.findIndex((x) => x.id === action.payload)
      state.permission.data.splice(index, 1)
    }
  }
})

export const {
  permissionDelete,
  permissionLoad,
  permissionSave,
  permissionUpdate,
  permissionView
} = permissionsSlice.actions

export default permissionsSlice.reducer
