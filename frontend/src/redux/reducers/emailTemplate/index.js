// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const emailTemplateSlice = createSlice({
  name: 'emailTemplate',
  initialState: {
    emailTemplate: {
      data: []
    },
    viewEmail: null
  },
  reducers: {
    emailTemplateView: (state, action) => {
      state.viewEmail = action?.payload
    },
    emailTemplateLoad: (state, action) => {
      state.emailTemplate = action?.payload
    },
    emailTemplateUpdate: (state, action) => {
      const index = state.emailTemplate.data.findIndex((x) => x.id === action.payload.id)
      state.emailTemplate.data[index] = action.payload
    },
    emailTemplateSave: (state, action) => {
      state.emailTemplate.data = [...action?.payload, ...state?.emailTemplate?.data]
    },
    emailTemplateDelete: (state, action) => {
      log(action)
      const index = state.emailTemplate.data.findIndex((x) => x.id === action.payload)
      state.emailTemplate.data.splice(index, 1)
    }
  }
})

export const {
  emailTemplateDelete,
  emailTemplateLoad,
  emailTemplateSave,
  emailTemplateUpdate,
  emailTemplateView
} = emailTemplateSlice.actions

export default emailTemplateSlice.reducer
