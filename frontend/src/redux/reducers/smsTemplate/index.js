// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const smsTemplateSlice = createSlice({
  name: 'smsTemplate',
  initialState: {
    smsTemplate: {
      data: []
    },
    viewEmail: null
  },
  reducers: {
    smsTemplateLoad: (state, action) => {
      state.smsTemplate = action?.payload
    },
    smsTemplateUpdate: (state, action) => {
      const index = state.smsTemplate.data.findIndex((x) => x.id === action.payload.id)
      state.smsTemplate.data[index] = action.payload
    },
    smsTemplateSave: (state, action) => {
      state.smsTemplate.data = [...action?.payload, ...state?.smsTemplate?.data]
    },
    smsTemplateDelete: (state, action) => {
      log(action)
      const index = state.smsTemplate.data.findIndex((x) => x.id === action.payload)
      state.smsTemplate.data.splice(index, 1)
    }
  }
})

export const { smsTemplateDelete, smsTemplateLoad, smsTemplateSave, smsTemplateUpdate } =
  smsTemplateSlice.actions

export default smsTemplateSlice.reducer
