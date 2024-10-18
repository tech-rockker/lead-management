// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const moduleSlice = createSlice({
  name: 'module',
  initialState: {
    module: {
      data: []
    }
  },
  reducers: {
    moduleLoad: (state, action) => {
      state.module = action?.payload
    },
    moduleUpdate: (state, action) => {
      const index = state.module.data.findIndex((x) => x.id === action.payload.id)
      state.module.data[index] = action.payload
    },
    moduleSave: (state, action) => {
      state.module.data = [...action?.payload, ...state?.module?.data]
    },
    moduleDelete: (state, action) => {
      log(action)
      const index = state.module.data.findIndex((x) => x.id === action.payload)
      state.module.data.splice(index, 1)
    }
  }
})

export const { moduleLoad, moduleUpdate, moduleSave, moduleDelete } = moduleSlice.actions

export default moduleSlice.reducer
