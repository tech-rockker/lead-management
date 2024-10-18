// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    questions: {
      data: []
    }
  },
  reducers: {
    questionLoad: (state, action) => {
      state.questions = action?.payload
    },
    questionUpdate: (state, action) => {
      const index = state.questions.data.findIndex((x) => x.id === action.payload.id)
      state.questions.data[index] = action.payload
    },
    questionSave: (state, action) => {
      state.questions.data = [...action?.payload, ...state?.questions?.data]
    },
    questionDelete: (state, action) => {
      log(action)
      const index = state.questions.data.findIndex((x) => x.id === action.payload)
      state.questions.data.splice(index, 1)
    }
  }
})

export const { questionDelete, questionLoad, questionSave, questionUpdate } = questionSlice.actions

export default questionSlice.reducer
