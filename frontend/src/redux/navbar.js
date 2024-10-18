// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { getBookMarks, updateBookMark } from '../utility/apis/commons'
import { getBookmarked } from '../utility/Utils'

export const getBookmarks = createAsyncThunk('layout/getBookmarks', async () => {
  const response = await getBookMarks({ async: true })
  return {
    data: response.data?.payload?.bookmarklist,
    bookmarks: getBookmarked(response.data?.payload?.bookmarked)
  }
})

export const updateBookmarked = createAsyncThunk('layout/updateBookmarked', async (jsonData) => {
  const response = await updateBookMark({ async: true, jsonData })
  return {
    data: response.data?.payload?.bookmarklist,
    bookmarks: getBookmarked(response.data?.payload?.bookmarked)
  }
})

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    query: '',
    bookmarks: [],
    suggestions: []
  },
  reducers: {
    handleSearchQuery: (state, action) => {
      state.query = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookmarks.fulfilled, (state, action) => {
        state.suggestions = action.payload.data
        state.bookmarks = action.payload.bookmarks
      })
      .addCase(updateBookmarked.fulfilled, (state, action) => {
        state.suggestions = action.payload.data
        state.bookmarks = action.payload.bookmarks
      })
  }
})

export const { handleSearchQuery } = layoutSlice.actions

export default layoutSlice.reducer
