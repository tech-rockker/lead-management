import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'
////categoryTypes
export const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    comment: {
      data: []
    }
  },
  reducers: {
    loadComment: (state, action) => {
      state.comment = action?.payload
    },
    updateComment: (state, action) => {
      const index = state.categoryTypes.data.findIndex((x) => x.id === action.payload.id)
      state.comment.data[index] = action.payload
    },
    saveComment: (state, action) => {
      state.comment.data = [...action?.payload, ...state?.comment?.data]
    },
    deleteComment: (state, action) => {
      log(action)
      const index = state.comment.data.findIndex((x) => x.id === action.payload)
      state.comment.data.splice(index, 1)
    }
  }
})

export const { loadComment, updateComment, saveComment, deleteComment } = commentSlice.actions

export default commentSlice.reducer
