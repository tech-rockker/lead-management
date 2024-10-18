// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const wordSlice = createSlice({
  name: 'word',
  initialState: {
    word: {
      data: []
    },
    words: []
  },
  reducers: {
    wordLoad: (state, action) => {
      state.word = action?.payload
    },
    wordLoadAll: (state, action) => {
      state.words = action?.payload
    },
    wordUpdate: (state, action) => {
      const index = state.word.data.findIndex((x) => x.id === action.payload.id)
      state.word.data[index] = action.payload
    },
    wordSave: (state, action) => {
      state.word.data = [...action?.payload, ...state?.word?.data]
    },
    wordDelete: (state, action) => {
      log(action)
      const index = state.word.data.findIndex((x) => x.id === action.payload)
      state.word.data.splice(index, 1)
    }
  }
})

export const { wordLoad, wordLoadAll, wordUpdate, wordSave, wordDelete } = wordSlice.actions

export default wordSlice.reducer
