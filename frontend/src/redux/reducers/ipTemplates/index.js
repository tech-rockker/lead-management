// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const ipSlice = createSlice({
  name: 'ip',
  initialState: {
    templates: {
      data: []
    }
  },
  reducers: {
    ipTemplateLoad: (state, action) => {
      state.templates = action?.payload
    },
    IpTemplateView: (state, action) => {
      const index = state.templates.data.findIndex((x) => x.id === action.payload.id)
      state.templates.data[index] = action.payload
    },
    IpTemplateUpdate: (state, action) => {
      const index = state.templates.data.findIndex((x) => x.id === action.payload.id)
      state.templates.data[index] = action.payload
    },
    IpTemplateSave: (state, action) => {
      state.templates.data = [...action?.payload, ...state?.templates?.data]
    },
    IpTemplateDelete: (state, action) => {
      log(action)
      const index = state.templates.data.findIndex((x) => x.id === action.payload)
      state.templates.data.splice(index, 1)
    }
  }
})

export const {
  IpTemplateDelete,
  IpTemplateSave,
  ipTemplateLoad,
  IpTemplateUpdate,
  IpTemplateView
} = ipSlice.actions

export default ipSlice.reducer
