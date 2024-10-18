// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: {
      data: []
    }
  },
  reducers: {
    roleLoad: (state, action) => {
      state.roles = action?.payload
    },
    roleView: (state, action) => {
      const index = state.roles.data.findIndex((x) => x.id === action.payload.id)
      state.roles.data[index] = action.payload
    },
    roleUpdate: (state, action) => {
      const index = state.roles.data.findIndex((x) => x.id === action.payload.id)
      state.roles.data[index] = action.payload
    },
    roleSave: (state, action) => {
      state.roles.data = [...action?.payload, ...state?.roles?.data]
    },
    roleDelete: (state, action) => {
      log(action)
      const index = state.roles.data.findIndex((x) => x.id === action.payload)
      state.roles.data.splice(index, 1)
    }
  }
})

export const { roleDelete, roleLoad, roleSave, roleUpdate, roleView } = roleSlice.actions

export default roleSlice.reducer
