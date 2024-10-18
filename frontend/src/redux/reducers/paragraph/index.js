// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const paragraphSlice = createSlice({
  name: 'paragraph',
  initialState: {
    paragraph: {
      data: []
    }
  },
  reducers: {
    paragraphLoad: (state, action) => {
      state.paragraph = action?.payload
    },
    paragraphUpdate: (state, action) => {
      const index = state.paragraph.data.findIndex((x) => x.id === action.payload.id)
      state.paragraph.data[index] = action.payload
    },
    paragraphSave: (state, action) => {
      state.paragraph.data = [...action?.payload, ...state?.paragraph?.data]
    },
    pargraphDelete: (state, action) => {
      log(action)
      const index = state.paragraph.data.findIndex((x) => x.id === action.payload)
      state.paragraph.data.splice(index, 1)
    }
  }
})

export const { paragraphLoad, paragraphSave, paragraphUpdate, pargraphDelete } =
  paragraphSlice.actions

export default paragraphSlice.reducer
