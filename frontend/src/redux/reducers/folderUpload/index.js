// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loadFolders, updateFileFolderBookmark } from '../../../utility/apis/commons'
import { isValid, log } from '../../../utility/helpers/common'
import { createBlankArray, getStartEndDate } from '../../../utility/Utils'

/**
 *
 * @param page
 * @param perPage
 * @param isBookmarked
 * @param searchKey
 * @param jsonData
 * @param loadMore
 */
export const fetchFolders = createAsyncThunk(
  'timeline/fetchFolders',
  async (
    { page = 1, perPage, isBookmarked, searchKey, jsonData, loadMore = false },
    { rejectWithValue }
  ) => {
    const response = await loadFolders({
      async: true,
      page,
      perPage,
      jsonData,
      is_bookmark: isBookmarked,
      search_key: searchKey
    })
    return {
      ...response.data?.payload,
      loadMore,
      page
    }
  }
)

export const updateBookmarked = createAsyncThunk(
  'manageFile/updateBookmarked',
  async (jsonData) => {
    try {
      const response = await updateFileFolderBookmark({ async: true, jsonData })
      return response.data
    } catch (error) {
      throw error
    }
  }
)
export const folderSlice = createSlice({
  name: 'folderupload',
  initialState: {
    loading: false,
    loadMore: false,
    end: false,
    viewFolder: {
      total: 0,
      currentPage: '',
      perPage: '',
      lastPage: 0,
      data: [],
      is_bookmark: false
    },
    folderUser: {
      data: []
    }
  },
  reducers: {
    uploadFolder: (state, action) => {
      state.folderUser.data = [...action?.payload, ...state?.folderUser?.data]
    },
    viewFolder: (state, action) => {
      state.viewFolder = action?.payload
    },
    folderUpdate: (state, action) => {
      const index = state.folderUser.data.findIndex((x) => x.id === action.payload.id)
      state.folderUser.data[index] = action.payload
    },
    folderDelete: (state, action) => {
      const index = state.viewFolder.data.findIndex((x) => x.id === action.payload.id)
      if (index >= 0) {
        state.viewFolder.data.splice(index, 1)
      }
    },
    updateIsBookmark: (state, action) => {
      const { id } = action.payload
      const index = state.viewFolder.data.findIndex((x) => x.id === id)
      if (index !== -1) {
        state.viewFolder.data[index].is_bookmark = !state.viewFolder.data[index].is_bookmark
      }
      return state
    }
  },
  extraReducers: {
    [fetchFolders.pending]: (state, { meta }) => {
      state.loading = !meta?.arg?.loadMore
      state.loadMore = meta?.arg?.loadMore
      if (meta?.arg?.loadMore) {
        const old = state.viewFolder?.data ?? []
        const all = old.concat(createBlankArray(meta?.arg?.perPage))
        state.viewFolder = {
          ...state.viewFolder,
          data: all
        }
      } else {
        state.viewFolder = {
          ...state.viewFolder,
          data: createBlankArray(meta?.arg?.perPage)
        }
      }
    },
    [fetchFolders.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.end = payload?.last_page !== 0 ? payload?.page === payload?.last_page : true

      if (state.loadMore) {
        // If it's a "load more" action, add only the new data
        state.viewFolder = {
          ...state.viewFolder,
          ...payload,
          loadMore: false
        }
      } else {
        state.viewFolder = {
          ...payload,
          ...getStartEndDate(payload?.data)
        }
      }
    },
    [fetchFolders.rejected]: (state) => {
      state.loading = false
      state.loadingMore = false
      state.end = true
      state.viewFolder.data = []
    }
    // end load activity
  }
})

export const { uploadFolder, viewFolder, folderUpdate, folderDelete, updateIsBookmark } =
  folderSlice.actions

export default folderSlice.reducer
